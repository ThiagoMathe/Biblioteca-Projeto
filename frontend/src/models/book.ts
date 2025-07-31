export interface Book {
  id: number
  title: string
  author: string
  genre: string
  format: "Hybrid" | "Digital" | "Physic"
  availability: "Available" | "Unavailable"
  pubDate: string
  imageBase64: string
}

export type BookForm = Omit<Book, 'id'>;