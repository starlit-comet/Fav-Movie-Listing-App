import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { Favorite } from '../models';

const router = Router();

// GET /favorites - list current user's favorites with pagination
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const limit = Math.max(1, Math.min(50, parseInt(String(req.query.limit ?? '10'), 10) || 10));
    const offset = Math.max(0, parseInt(String(req.query.offset ?? '0'), 10) || 0);

    const total = await Favorite.count({ where: { userId } });
    const items = await Favorite.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    const nextOffset = offset + items.length < total ? offset + items.length : null;
    return res.json({ items, total, nextOffset });
  } catch (err) {
    console.error('List favorites error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /favorites - create a favorite
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id as number | undefined;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, type, year, rating, director, durationMinutes, description, location, budget } = req.body as {
      title?: string;
      type?: 'movie' | 'tv';
      year?: number;
      rating?: number;
      director?: string | null;
      durationMinutes?: number | null;
      description?: string | null;
      location?: string | null;
      budget?: number | null;
    };

    if (!title || !type || (type !== 'movie' && type !== 'tv')) {
      return res.status(400).json({ message: 'title and valid type are required' });
    }

    const created = await Favorite.create({
      userId,
      title,
      type,
      year: year ?? null,
      rating: typeof rating === 'number' ? rating : null,
      director: director ?? null,
      durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : null,
      description: description ?? null,
      location: location ?? null,
      budget: typeof budget === 'number' ? budget : null,
    });

    return res.status(201).json({ item: created });
  } catch (err) {
    console.error('Create favorite error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
