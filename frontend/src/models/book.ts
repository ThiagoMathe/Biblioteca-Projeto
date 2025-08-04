export interface Book {
  id: number
  title: string
  description: string
  author: string
  genre: string
  format: "Hybrid" | "Digital" | "Physic" | ""
  availability: true | false
  pubDate: string
  imageBase64: string
}

export type BookForm = Omit<Book, 'id'>;