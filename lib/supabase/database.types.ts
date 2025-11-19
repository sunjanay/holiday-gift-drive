export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gift_recipients: {
        Row: {
          id: string
          name: string
          age: number | null
          story: string
          gift_title: string
          gift_description: string
          gift_price: number
          amazon_wishlist_url: string
          ornament_color: 'red' | 'gold' | 'silver' | 'green' | 'blue'
          position_top: string
          position_left: string
          purchased: boolean
          purchased_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age?: number | null
          story: string
          gift_title: string
          gift_description: string
          gift_price: number
          amazon_wishlist_url: string
          ornament_color: 'red' | 'gold' | 'silver' | 'green' | 'blue'
          position_top: string
          position_left: string
          purchased?: boolean
          purchased_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number | null
          story?: string
          gift_title?: string
          gift_description?: string
          gift_price?: number
          amazon_wishlist_url?: string
          ornament_color?: 'red' | 'gold' | 'silver' | 'green' | 'blue'
          position_top?: string
          position_left?: string
          purchased?: boolean
          purchased_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
