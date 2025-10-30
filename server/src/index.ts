import { sequelize, User, Favorite } from './models';
import type { FavoriteCreationAttributes } from './models/Favorite';
import { pbkdf2Sync } from 'crypto';
import app from './app';

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('Database synced');

  // Seed: if no users exist, create default user and 20 favorites
  try {
    const usersCount = await User.count();
    if (usersCount === 0) {
      const PASSWORD_SALT = '10';
      const ITERATIONS = 100_000;
      const KEYLEN = 64;
      const DIGEST = 'sha512';
      const passwordHash = pbkdf2Sync('User@123', PASSWORD_SALT, ITERATIONS, KEYLEN, DIGEST).toString('hex');

      const user = await User.create({
        name: 'User',
        email: 'user@gmail.com',
        passwordHash,
      });

      const seeds: FavoriteCreationAttributes[] = [
        // Movies
        { userId: user.id, title: 'Inception', type: 'movie', year: 2010, rating: 8.8, director: 'Christopher Nolan', durationMinutes: 148, location: 'Los Angeles / Tokyo / Paris', budget: 160_000_000 },
        { userId: user.id, title: 'Interstellar', type: 'movie', year: 2014, rating: 8.6, director: 'Christopher Nolan', durationMinutes: 169, location: 'Iceland', budget: 165_000_000 },
        { userId: user.id, title: 'The Matrix', type: 'movie', year: 1999, rating: 8.7, director: 'The Wachowskis', durationMinutes: 136, location: 'Sydney', budget: 63_000_000 },
        { userId: user.id, title: 'The Dark Knight', type: 'movie', year: 2008, rating: 9.0, director: 'Christopher Nolan', durationMinutes: 152, location: 'Chicago', budget: 185_000_000 },
        { userId: user.id, title: 'Parasite', type: 'movie', year: 2019, rating: 8.6, director: 'Bong Joon-ho', durationMinutes: 132, location: 'Seoul', budget: 11_400_000 },
        { userId: user.id, title: 'The Prestige', type: 'movie', year: 2006, rating: 8.5, director: 'Christopher Nolan', durationMinutes: 130, location: 'London', budget: 40_000_000 },
        { userId: user.id, title: 'Spirited Away', type: 'movie', year: 2001, rating: 8.6, director: 'Hayao Miyazaki', durationMinutes: 125, location: 'Tokyo', budget: 19_000_000 },
        { userId: user.id, title: 'Gladiator', type: 'movie', year: 2000, rating: 8.5, director: 'Ridley Scott', durationMinutes: 155, location: 'Malta', budget: 103_000_000 },
        { userId: user.id, title: 'Pulp Fiction', type: 'movie', year: 1994, rating: 8.9, director: 'Quentin Tarantino', durationMinutes: 154, location: 'Los Angeles', budget: 8_000_000 },
        { userId: user.id, title: 'The Shawshank Redemption', type: 'movie', year: 1994, rating: 9.3, director: 'Frank Darabont', durationMinutes: 142, location: 'Ohio', budget: 25_000_000 },
        // TV Shows
        { userId: user.id, title: 'Breaking Bad', type: 'tv', year: 2008, rating: 9.5, director: 'Vince Gilligan', durationMinutes: 49, location: 'Albuquerque', budget: 3_000_000 },
        { userId: user.id, title: 'Game of Thrones', type: 'tv', year: 2011, rating: 9.2, director: 'D. Benioff & D. B. Weiss', durationMinutes: 57, location: 'Northern Ireland', budget: 6_000_000 },
        { userId: user.id, title: 'The Office', type: 'tv', year: 2005, rating: 8.9, director: 'Greg Daniels', durationMinutes: 22, location: 'Scranton', budget: 2_000_000 },
        { userId: user.id, title: 'Stranger Things', type: 'tv', year: 2016, rating: 8.7, director: 'Duffer Brothers', durationMinutes: 51, location: 'Atlanta', budget: 8_000_000 },
        { userId: user.id, title: 'The Wire', type: 'tv', year: 2002, rating: 9.3, director: 'David Simon', durationMinutes: 59, location: 'Baltimore', budget: 1_500_000 },
        { userId: user.id, title: 'Chernobyl', type: 'tv', year: 2019, rating: 9.4, director: 'Johan Renck', durationMinutes: 60, location: 'Vilnius', budget: 5_000_000 },
        { userId: user.id, title: 'Dark', type: 'tv', year: 2017, rating: 8.7, director: 'Baran bo Odar', durationMinutes: 53, location: 'Berlin', budget: 2_000_000 },
        { userId: user.id, title: 'The Mandalorian', type: 'tv', year: 2019, rating: 8.7, director: 'Jon Favreau', durationMinutes: 39, location: 'Los Angeles', budget: 15_000_000 },
        { userId: user.id, title: 'Sherlock', type: 'tv', year: 2010, rating: 9.1, director: 'Steven Moffat', durationMinutes: 90, location: 'London', budget: 1_000_000 },
        { userId: user.id, title: 'Friends', type: 'tv', year: 1994, rating: 8.9, director: 'David Crane & Marta Kauffman', durationMinutes: 22, location: 'New York', budget: 1_000_000 },
        

         { userId: user.id, title: 'Inception', type: 'movie', year: 2010, rating: 8.8, director: 'Christopher Nolan', durationMinutes: 148, location: 'Los Angeles / Tokyo / Paris', budget: 160_000_000 },
  { userId: user.id, title: 'Interstellar', type: 'movie', year: 2014, rating: 8.6, director: 'Christopher Nolan', durationMinutes: 169, location: 'Iceland', budget: 165_000_000 },
  { userId: user.id, title: 'The Matrix', type: 'movie', year: 1999, rating: 8.7, director: 'The Wachowskis', durationMinutes: 136, location: 'Sydney', budget: 63_000_000 },
  { userId: user.id, title: 'The Dark Knight', type: 'movie', year: 2008, rating: 9.0, director: 'Christopher Nolan', durationMinutes: 152, location: 'Chicago', budget: 185_000_000 },
  { userId: user.id, title: 'Parasite', type: 'movie', year: 2019, rating: 8.6, director: 'Bong Joon-ho', durationMinutes: 132, location: 'Seoul', budget: 11_400_000 },
  { userId: user.id, title: 'The Prestige', type: 'movie', year: 2006, rating: 8.5, director: 'Christopher Nolan', durationMinutes: 130, location: 'London', budget: 40_000_000 },
  { userId: user.id, title: 'Spirited Away', type: 'movie', year: 2001, rating: 8.6, director: 'Hayao Miyazaki', durationMinutes: 125, location: 'Tokyo', budget: 19_000_000 },
  { userId: user.id, title: 'Gladiator', type: 'movie', year: 2000, rating: 8.5, director: 'Ridley Scott', durationMinutes: 155, location: 'Malta', budget: 103_000_000 },
  { userId: user.id, title: 'Pulp Fiction', type: 'movie', year: 1994, rating: 8.9, director: 'Quentin Tarantino', durationMinutes: 154, location: 'Los Angeles', budget: 8_000_000 },
  { userId: user.id, title: 'The Shawshank Redemption', type: 'movie', year: 1994, rating: 9.3, director: 'Frank Darabont', durationMinutes: 142, location: 'Ohio', budget: 25_000_000 },

  { userId: user.id, title: 'Fight Club', type: 'movie', year: 1999, rating: 8.8, director: 'David Fincher', durationMinutes: 139, location: 'Los Angeles', budget: 63_000_000 },
  { userId: user.id, title: 'Forrest Gump', type: 'movie', year: 1994, rating: 8.8, director: 'Robert Zemeckis', durationMinutes: 142, location: 'Georgia', budget: 55_000_000 },
  { userId: user.id, title: 'Titanic', type: 'movie', year: 1997, rating: 7.9, director: 'James Cameron', durationMinutes: 195, location: 'Atlantic Ocean', budget: 200_000_000 },
  { userId: user.id, title: 'Avatar', type: 'movie', year: 2009, rating: 7.8, director: 'James Cameron', durationMinutes: 162, location: 'Pandora', budget: 237_000_000 },
  { userId: user.id, title: 'The Godfather', type: 'movie', year: 1972, rating: 9.2, director: 'Francis Ford Coppola', durationMinutes: 175, location: 'New York', budget: 6_000_000 },
  { userId: user.id, title: 'The Godfather: Part II', type: 'movie', year: 1974, rating: 9.0, director: 'Francis Ford Coppola', durationMinutes: 202, location: 'New York / Sicily', budget: 13_000_000 },
  { userId: user.id, title: 'Se7en', type: 'movie', year: 1995, rating: 8.6, director: 'David Fincher', durationMinutes: 127, location: 'Los Angeles', budget: 33_000_000 },
  { userId: user.id, title: 'The Silence of the Lambs', type: 'movie', year: 1991, rating: 8.6, director: 'Jonathan Demme', durationMinutes: 118, location: 'Pittsburgh', budget: 19_000_000 },
  { userId: user.id, title: 'Whiplash', type: 'movie', year: 2014, rating: 8.5, director: 'Damien Chazelle', durationMinutes: 107, location: 'New York', budget: 3_300_000 },
  { userId: user.id, title: 'Joker', type: 'movie', year: 2019, rating: 8.4, director: 'Todd Phillips', durationMinutes: 122, location: 'New York', budget: 55_000_000 },
  { userId: user.id, title: 'La La Land', type: 'movie', year: 2016, rating: 8.0, director: 'Damien Chazelle', durationMinutes: 128, location: 'Los Angeles', budget: 30_000_000 },
  { userId: user.id, title: 'The Social Network', type: 'movie', year: 2010, rating: 7.7, director: 'David Fincher', durationMinutes: 120, location: 'Harvard / California', budget: 40_000_000 },
  { userId: user.id, title: 'The Revenant', type: 'movie', year: 2015, rating: 8.0, director: 'Alejandro G. Iñárritu', durationMinutes: 156, location: 'Canada', budget: 135_000_000 },
  { userId: user.id, title: 'Mad Max: Fury Road', type: 'movie', year: 2015, rating: 8.1, director: 'George Miller', durationMinutes: 120, location: 'Namibia', budget: 150_000_000 },
  { userId: user.id, title: 'Dune', type: 'movie', year: 2021, rating: 8.0, director: 'Denis Villeneuve', durationMinutes: 155, location: 'Jordan', budget: 165_000_000 },
  { userId: user.id, title: 'Blade Runner 2049', type: 'movie', year: 2017, rating: 8.0, director: 'Denis Villeneuve', durationMinutes: 164, location: 'Budapest', budget: 150_000_000 },
  { userId: user.id, title: 'The Wolf of Wall Street', type: 'movie', year: 2013, rating: 8.2, director: 'Martin Scorsese', durationMinutes: 180, location: 'New York', budget: 100_000_000 },
  { userId: user.id, title: 'Shutter Island', type: 'movie', year: 2010, rating: 8.2, director: 'Martin Scorsese', durationMinutes: 138, location: 'Boston', budget: 80_000_000 },
  { userId: user.id, title: 'Oppenheimer', type: 'movie', year: 2023, rating: 8.6, director: 'Christopher Nolan', durationMinutes: 180, location: 'Los Alamos', budget: 100_000_000 },
  { userId: user.id, title: 'Tenet', type: 'movie', year: 2020, rating: 7.3, director: 'Christopher Nolan', durationMinutes: 150, location: 'Tallinn', budget: 200_000_000 },
  { userId: user.id, title: 'The Irishman', type: 'movie', year: 2019, rating: 7.8, director: 'Martin Scorsese', durationMinutes: 209, location: 'New York', budget: 159_000_000 },
  { userId: user.id, title: '1917', type: 'movie', year: 2019, rating: 8.2, director: 'Sam Mendes', durationMinutes: 119, location: 'England', budget: 95_000_000 },
  { userId: user.id, title: 'The Lion King', type: 'movie', year: 1994, rating: 8.5, director: 'Roger Allers', durationMinutes: 88, location: 'Africa (Animated)', budget: 45_000_000 },
  { userId: user.id, title: 'Coco', type: 'movie', year: 2017, rating: 8.4, director: 'Lee Unkrich', durationMinutes: 105, location: 'Mexico (Animated)', budget: 175_000_000 },
  { userId: user.id, title: 'Inside Out', type: 'movie', year: 2015, rating: 8.1, director: 'Pete Docter', durationMinutes: 95, location: 'San Francisco (Animated)', budget: 175_000_000 },
  { userId: user.id, title: 'Avengers: Endgame', type: 'movie', year: 2019, rating: 8.4, director: 'Russo Brothers', durationMinutes: 181, location: 'Atlanta', budget: 356_000_000 },
  { userId: user.id, title: 'Guardians of the Galaxy', type: 'movie', year: 2014, rating: 8.0, director: 'James Gunn', durationMinutes: 121, location: 'Space', budget: 170_000_000 },
  { userId: user.id, title: 'Doctor Strange', type: 'movie', year: 2016, rating: 7.5, director: 'Scott Derrickson', durationMinutes: 115, location: 'Kathmandu', budget: 165_000_000 },
  { userId: user.id, title: 'Black Panther', type: 'movie', year: 2018, rating: 7.3, director: 'Ryan Coogler', durationMinutes: 134, location: 'Wakanda', budget: 200_000_000 },
  { userId: user.id, title: 'Iron Man', type: 'movie', year: 2008, rating: 7.9, director: 'Jon Favreau', durationMinutes: 126, location: 'California', budget: 140_000_000 },
  { userId: user.id, title: 'The Avengers', type: 'movie', year: 2012, rating: 8.0, director: 'Joss Whedon', durationMinutes: 143, location: 'New York', budget: 220_000_000 },
  { userId: user.id, title: 'Captain America: Civil War', type: 'movie', year: 2016, rating: 7.8, director: 'Russo Brothers', durationMinutes: 147, location: 'Berlin', budget: 250_000_000 },

  // --- TV Shows (10 existing + 40 new = 50) ---
  { userId: user.id, title: 'Breaking Bad', type: 'tv', year: 2008, rating: 9.5, director: 'Vince Gilligan', durationMinutes: 49, location: 'Albuquerque', budget: 3_000_000 },
  { userId: user.id, title: 'Game of Thrones', type: 'tv', year: 2011, rating: 9.2, director: 'D. Benioff & D. B. Weiss', durationMinutes: 57, location: 'Northern Ireland', budget: 6_000_000 },
  { userId: user.id, title: 'The Office', type: 'tv', year: 2005, rating: 8.9, director: 'Greg Daniels', durationMinutes: 22, location: 'Scranton', budget: 2_000_000 },
  { userId: user.id, title: 'Stranger Things', type: 'tv', year: 2016, rating: 8.7, director: 'Duffer Brothers', durationMinutes: 51, location: 'Atlanta', budget: 8_000_000 },
  { userId: user.id, title: 'The Wire', type: 'tv', year: 2002, rating: 9.3, director: 'David Simon', durationMinutes: 59, location: 'Baltimore', budget: 1_500_000 },
  { userId: user.id, title: 'Chernobyl', type: 'tv', year: 2019, rating: 9.4, director: 'Johan Renck', durationMinutes: 60, location: 'Vilnius', budget: 5_000_000 },
  { userId: user.id, title: 'Dark', type: 'tv', year: 2017, rating: 8.7, director: 'Baran bo Odar', durationMinutes: 53, location: 'Berlin', budget: 2_000_000 },
  { userId: user.id, title: 'The Mandalorian', type: 'tv', year: 2019, rating: 8.7, director: 'Jon Favreau', durationMinutes: 39, location: 'Los Angeles', budget: 15_000_000 },
  { userId: user.id, title: 'Sherlock', type: 'tv', year: 2010, rating: 9.1, director: 'Steven Moffat', durationMinutes: 90, location: 'London', budget: 1_000_000 },
  { userId: user.id, title: 'Friends', type: 'tv', year: 1994, rating: 8.9, director: 'David Crane & Marta Kauffman', durationMinutes: 22, location: 'New York', budget: 1_000_000 },
  
    // --- Movies (25 new) ---
  { userId: user.id, title: 'Everything Everywhere All at Once', type: 'movie', year: 2022, rating: 8.0, director: 'Daniel Kwan & Daniel Scheinert', durationMinutes: 139, location: 'Los Angeles', budget: 25_000_000 },
  { userId: user.id, title: 'The Grand Budapest Hotel', type: 'movie', year: 2014, rating: 8.1, director: 'Wes Anderson', durationMinutes: 99, location: 'Germany', budget: 25_000_000 },
  { userId: user.id, title: 'Her', type: 'movie', year: 2013, rating: 8.0, director: 'Spike Jonze', durationMinutes: 126, location: 'Los Angeles', budget: 23_000_000 },
  { userId: user.id, title: 'The Imitation Game', type: 'movie', year: 2014, rating: 8.0, director: 'Morten Tyldum', durationMinutes: 113, location: 'London', budget: 14_000_000 },
  { userId: user.id, title: 'The Pianist', type: 'movie', year: 2002, rating: 8.5, director: 'Roman Polanski', durationMinutes: 150, location: 'Warsaw', budget: 35_000_000 },
  { userId: user.id, title: 'The Departed', type: 'movie', year: 2006, rating: 8.5, director: 'Martin Scorsese', durationMinutes: 151, location: 'Boston', budget: 90_000_000 },
  { userId: user.id, title: 'Good Will Hunting', type: 'movie', year: 1997, rating: 8.3, director: 'Gus Van Sant', durationMinutes: 126, location: 'Boston', budget: 10_000_000 },
  { userId: user.id, title: 'A Beautiful Mind', type: 'movie', year: 2001, rating: 8.2, director: 'Ron Howard', durationMinutes: 135, location: 'New Jersey', budget: 58_000_000 },
  { userId: user.id, title: 'The Truman Show', type: 'movie', year: 1998, rating: 8.2, director: 'Peter Weir', durationMinutes: 103, location: 'Florida', budget: 60_000_000 },
  { userId: user.id, title: 'The Green Mile', type: 'movie', year: 1999, rating: 8.6, director: 'Frank Darabont', durationMinutes: 189, location: 'North Carolina', budget: 60_000_000 },
  { userId: user.id, title: 'The Sixth Sense', type: 'movie', year: 1999, rating: 8.1, director: 'M. Night Shyamalan', durationMinutes: 107, location: 'Philadelphia', budget: 40_000_000 },
  { userId: user.id, title: 'The Curious Case of Benjamin Button', type: 'movie', year: 2008, rating: 7.8, director: 'David Fincher', durationMinutes: 166, location: 'New Orleans', budget: 150_000_000 },
  { userId: user.id, title: 'No Country for Old Men', type: 'movie', year: 2007, rating: 8.2, director: 'Coen Brothers', durationMinutes: 122, location: 'Texas', budget: 25_000_000 },
  { userId: user.id, title: 'Slumdog Millionaire', type: 'movie', year: 2008, rating: 8.0, director: 'Danny Boyle', durationMinutes: 120, location: 'Mumbai', budget: 15_000_000 },
  { userId: user.id, title: 'The Big Short', type: 'movie', year: 2015, rating: 7.8, director: 'Adam McKay', durationMinutes: 130, location: 'New York', budget: 50_000_000 },
  { userId: user.id, title: 'Inglourious Basterds', type: 'movie', year: 2009, rating: 8.3, director: 'Quentin Tarantino', durationMinutes: 153, location: 'France', budget: 70_000_000 },
  { userId: user.id, title: 'Django Unchained', type: 'movie', year: 2012, rating: 8.4, director: 'Quentin Tarantino', durationMinutes: 165, location: 'Texas', budget: 100_000_000 },
  { userId: user.id, title: 'The Hateful Eight', type: 'movie', year: 2015, rating: 7.8, director: 'Quentin Tarantino', durationMinutes: 168, location: 'Wyoming', budget: 44_000_000 },
  { userId: user.id, title: 'Interstate 60', type: 'movie', year: 2002, rating: 7.6, director: 'Bob Gale', durationMinutes: 116, location: 'USA', budget: 10_000_000 },
  { userId: user.id, title: 'The Martian', type: 'movie', year: 2015, rating: 8.0, director: 'Ridley Scott', durationMinutes: 144, location: 'Mars / Budapest', budget: 108_000_000 },
  { userId: user.id, title: 'Arrival', type: 'movie', year: 2016, rating: 7.9, director: 'Denis Villeneuve', durationMinutes: 116, location: 'Montana', budget: 47_000_000 },
  { userId: user.id, title: 'Ex Machina', type: 'movie', year: 2014, rating: 7.7, director: 'Alex Garland', durationMinutes: 108, location: 'Norway', budget: 15_000_000 },
  { userId: user.id, title: 'The Shape of Water', type: 'movie', year: 2017, rating: 7.3, director: 'Guillermo del Toro', durationMinutes: 123, location: 'Baltimore', budget: 19_000_000 },
  { userId: user.id, title: 'Gravity', type: 'movie', year: 2013, rating: 7.7, director: 'Alfonso Cuarón', durationMinutes: 91, location: 'Space', budget: 100_000_000 },
  { userId: user.id, title: 'The Sound of Music', type: 'movie', year: 1965, rating: 8.1, director: 'Robert Wise', durationMinutes: 172, location: 'Austria', budget: 8_200_000 },

  // --- TV Shows (25 new) ---
  { userId: user.id, title: 'Better Call Saul', type: 'tv', year: 2015, rating: 9.0, director: 'Vince Gilligan', durationMinutes: 46, location: 'Albuquerque', budget: 3_000_000 },
  { userId: user.id, title: 'Peaky Blinders', type: 'tv', year: 2013, rating: 8.8, director: 'Steven Knight', durationMinutes: 60, location: 'Birmingham', budget: 1_500_000 },
  { userId: user.id, title: 'House of Cards', type: 'tv', year: 2013, rating: 8.7, director: 'Beau Willimon', durationMinutes: 55, location: 'Washington D.C.', budget: 4_500_000 },
  { userId: user.id, title: 'Westworld', type: 'tv', year: 2016, rating: 8.5, director: 'Jonathan Nolan', durationMinutes: 60, location: 'Utah', budget: 9_000_000 },
  { userId: user.id, title: 'The Crown', type: 'tv', year: 2016, rating: 8.6, director: 'Peter Morgan', durationMinutes: 58, location: 'London', budget: 13_000_000 },
  { userId: user.id, title: 'The Boys', type: 'tv', year: 2019, rating: 8.7, director: 'Eric Kripke', durationMinutes: 60, location: 'Toronto', budget: 10_000_000 },
  { userId: user.id, title: 'Loki', type: 'tv', year: 2021, rating: 8.2, director: 'Kate Herron', durationMinutes: 50, location: 'Atlanta', budget: 25_000_000 },
  { userId: user.id, title: 'WandaVision', type: 'tv', year: 2021, rating: 8.0, director: 'Matt Shakman', durationMinutes: 45, location: 'Atlanta', budget: 20_000_000 },
  { userId: user.id, title: 'The Last of Us', type: 'tv', year: 2023, rating: 9.0, director: 'Craig Mazin', durationMinutes: 60, location: 'Calgary', budget: 15_000_000 },
  { userId: user.id, title: 'Succession', type: 'tv', year: 2018, rating: 8.9, director: 'Jesse Armstrong', durationMinutes: 60, location: 'New York', budget: 6_000_000 },
  { userId: user.id, title: 'Narcos', type: 'tv', year: 2015, rating: 8.8, director: 'Chris Brancato', durationMinutes: 49, location: 'Colombia', budget: 3_000_000 },
  { userId: user.id, title: 'Mindhunter', type: 'tv', year: 2017, rating: 8.6, director: 'David Fincher', durationMinutes: 55, location: 'Virginia', budget: 4_000_000 },
  { userId: user.id, title: 'The Witcher', type: 'tv', year: 2019, rating: 8.0, director: 'Lauren Schmidt Hissrich', durationMinutes: 60, location: 'Hungary', budget: 10_000_000 },
  { userId: user.id, title: 'Vikings', type: 'tv', year: 2013, rating: 8.5, director: 'Michael Hirst', durationMinutes: 44, location: 'Ireland', budget: 3_000_000 },
  { userId: user.id, title: 'The Expanse', type: 'tv', year: 2015, rating: 8.5, director: 'Mark Fergus', durationMinutes: 43, location: 'Toronto', budget: 5_000_000 },
  { userId: user.id, title: 'Mr. Robot', type: 'tv', year: 2015, rating: 8.6, director: 'Sam Esmail', durationMinutes: 49, location: 'New York', budget: 4_000_000 },
  { userId: user.id, title: 'True Detective', type: 'tv', year: 2014, rating: 9.0, director: 'Nic Pizzolatto', durationMinutes: 55, location: 'Louisiana', budget: 4_500_000 },
  { userId: user.id, title: 'Fargo', type: 'tv', year: 2014, rating: 8.9, director: 'Noah Hawley', durationMinutes: 53, location: 'Minnesota', budget: 3_500_000 },
  { userId: user.id, title: 'Black Mirror', type: 'tv', year: 2011, rating: 8.8, director: 'Charlie Brooker', durationMinutes: 60, location: 'London', budget: 2_000_000 },
  { userId: user.id, title: 'The Umbrella Academy', type: 'tv', year: 2019, rating: 7.9, director: 'Steve Blackman', durationMinutes: 50, location: 'Toronto', budget: 9_000_000 },
  { userId: user.id, title: 'The Haunting of Hill House', type: 'tv', year: 2018, rating: 8.6, director: 'Mike Flanagan', durationMinutes: 58, location: 'Georgia', budget: 6_000_000 },
  { userId: user.id, title: 'Money Heist', type: 'tv', year: 2017, rating: 8.2, director: 'Álex Pina', durationMinutes: 70, location: 'Madrid', budget: 2_500_000 },
  { userId: user.id, title: 'The Morning Show', type: 'tv', year: 2019, rating: 8.2, director: 'Mimi Leder', durationMinutes: 55, location: 'New York', budget: 15_000_000 },
  { userId: user.id, title: 'Ozark', type: 'tv', year: 2017, rating: 8.5, director: 'Bill Dubuque', durationMinutes: 60, location: 'Missouri', budget: 5_000_000 },
  { userId: user.id, title: 'Severance', type: 'tv', year: 2022, rating: 8.6, director: 'Ben Stiller', durationMinutes: 55, location: 'New York', budget: 10_000_000 }

];
      await Favorite.bulkCreate(seeds);
      console.log('Seeded default user and 20 favorites');
    }
  } catch (e) {
    console.warn('Seeding skipped/failed:', e);
  }

  const PORT = Number(process.env.PORT) || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
