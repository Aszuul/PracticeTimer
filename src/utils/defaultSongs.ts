import { Song } from '../types';

export const getDefaultSongs = (): Song[] => {
  const skillsPieces: Song[] = [
    { id: '1', name: 'C Major Scales', type: 'skills', createdAt: Date.now() },
    { id: '2', name: 'Arpeggio Exercises', type: 'skills', createdAt: Date.now() },
    { id: '3', name: 'Hanon Etude #1', type: 'skills', createdAt: Date.now() },
    { id: '4', name: 'Czerny Op. 299 No. 1', type: 'skills', createdAt: Date.now() },
    { id: '5', name: 'Arpeggios (All Keys)', type: 'skills', createdAt: Date.now() },
    { id: '6', name: 'Chromatic Scales', type: 'skills', createdAt: Date.now() },
    { id: '7', name: 'Bach Two-Part Invention No. 1', type: 'skills', createdAt: Date.now() },
    { id: '8', name: 'Sight-Reading Etudes', type: 'skills', createdAt: Date.now() },
  ];

  const targetPieces: Song[] = [
    { id: '9', name: 'Bach Minuet in G', type: 'target', createdAt: Date.now() },
    { id: '10', name: 'Mozart Rondo', type: 'target', createdAt: Date.now() },
    { id: '11', name: 'Seitz Concerto No. 3', type: 'target', createdAt: Date.now() },
    { id: '12', name: 'Suzuki Vol. 3 Piece', type: 'target', createdAt: Date.now() },
    { id: '13', name: 'Vivaldi Concerto in A Minor', type: 'target', createdAt: Date.now() },
    { id: '14', name: 'Kabalevsky Op. 60 No. 1', type: 'target', createdAt: Date.now() },
    { id: '15', name: 'Wohlfahrt Op. 45 No. 1', type: 'target', createdAt: Date.now() },
    { id: '16', name: 'Telemann Sonata', type: 'target', createdAt: Date.now() },
  ];

  return [...skillsPieces, ...targetPieces];
};
