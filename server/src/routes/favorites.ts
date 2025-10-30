import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { Favorite } from '../models';
import { z } from 'zod';

const router = Router();

// GET /favorites - list current user's favorites with pagination
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const paginationSchema = z.object({
      limit: z.coerce.number().int().min(1).max(50).default(10),
      offset: z.coerce.number().int().min(0).default(0),
    });
    const { limit, offset } = paginationSchema.parse({
      limit: (req.query as any).limit,
      offset: (req.query as any).offset,
    });

    const total = await Favorite.count({ where: { userId } });
    const items = await Favorite.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    const nextOffset = offset + items.length < total ? offset + items.length : null;
    return res.json({ items, total, nextOffset });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid query', errors: err.flatten() });
    }
    console.error('List favorites error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /favorites/:id - delete a favorite
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const idSchema = z.coerce.number().int().positive();
    const id = idSchema.parse(req.params.id);

    const fav = await Favorite.findOne({ where: { id, userId } });
    if (!fav) return res.status(404).json({ message: 'Not found' });

    await fav.destroy();
    return res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Invalid id', errors: err.flatten() });
    console.error('Delete favorite error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /favorites - create a favorite
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const createSchema = z.object({
      title: z.string().min(1),
      type: z.enum(['movie', 'tv']),
      year: z.number().int().optional(),
      rating: z.number().min(0).max(10).optional(),
      director: z.string().trim().min(1).optional(),
      durationMinutes: z.number().int().min(0).optional(),
      description: z.string().trim().min(1).optional(),
      location: z.string().trim().min(1).optional(),
      budget: z.number().min(0).optional(),
    });

    const parsed = createSchema.parse(req.body ?? {});

    const created = await Favorite.create({
      userId,
      title: parsed.title,
      type: parsed.type as any,
      year: parsed.year ?? null,
      rating: parsed.rating ?? null,
      director: parsed.director ?? null,
      durationMinutes: parsed.durationMinutes ?? null,
      description: parsed.description ?? null,
      location: parsed.location ?? null,
      budget: parsed.budget ?? null,
    });

    return res.status(201).json({ item: created });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: err.flatten() });
    }
    console.error('Create favorite error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /favorites/:id - update a favorite
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const id = z.coerce.number().int().positive().parse(req.params.id);

    const fav = await Favorite.findOne({ where: { id, userId } });
    if (!fav) return res.status(404).json({ message: 'Not found' });

    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      type: z.enum(['movie', 'tv']).optional(),
      year: z.number().int().optional(),
      rating: z.number().min(0).max(10).optional(),
      director: z.string().trim().min(1).optional().nullable(),
      durationMinutes: z.number().int().min(0).optional(),
      description: z.string().trim().min(1).optional().nullable(),
      location: z.string().trim().min(1).optional().nullable(),
      budget: z.number().min(0).optional(),
    }).refine((obj: Record<string, unknown>) => Object.keys(obj).length > 0, { message: 'No fields to update' });

    const parsed = updateSchema.parse(req.body ?? {});

    await fav.update({
      title: parsed.title !== undefined ? parsed.title : fav.title,
      type: parsed.type !== undefined ? parsed.type as any : fav.type,
      director: parsed.director !== undefined ? (parsed.director ?? null) : fav.director,
      budget: parsed.budget !== undefined ? parsed.budget : fav.budget,
      location: parsed.location !== undefined ? (parsed.location ?? null) : fav.location,
      durationMinutes: parsed.durationMinutes !== undefined ? parsed.durationMinutes : fav.durationMinutes,
      year: parsed.year !== undefined ? parsed.year : fav.year,
      description: parsed.description !== undefined ? (parsed.description ?? null) : fav.description,
      rating: parsed.rating !== undefined ? parsed.rating : fav.rating,
    });

    return res.json(fav);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: err.flatten() });
    }
    console.error('Update favorite error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
