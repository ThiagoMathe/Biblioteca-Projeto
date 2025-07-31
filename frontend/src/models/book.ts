export interface Book {
  title: string
  author: string
  genre: string
  format: "Hybrid" | "Digital" | "Physic"
  availability: "Available" | "Unavailable"
  pubDate: string
}

export type BookForm = Omit<Book, 'id'>;