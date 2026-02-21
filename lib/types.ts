// lib/types.ts
export interface NewsItem {
  id: string
  title: string
  content: string
  url?: string   // optional instead of string | null
  createdAt?: string
  updatedAt?: string
}