export type Deck = {
  id: string;
  userId: string;
  name: string;
}

export type Card = {
  id: string,
  deckId: string,
  front: string,
  back: string,
}

