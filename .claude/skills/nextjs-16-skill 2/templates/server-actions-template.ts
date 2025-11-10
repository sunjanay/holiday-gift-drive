/**
 * Next.js 16 Server Actions Template
 * 
 * Type-safe server actions with validation and error handling
 */

'use server';

import { z } from 'zod';
import { revalidateTag, updateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Validation schemas
const CreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['tech', 'business', 'lifestyle']),
});

const UpdateSchema = CreateSchema.partial().extend({
  id: z.string(),
});

// Types
type CreateInput = z.infer<typeof CreateSchema>;
type UpdateInput = z.infer<typeof UpdateSchema>;

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

// CREATE ACTION
export async function createItem(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    // Extract and validate data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
    };
    
    const validated = CreateSchema.parse(rawData);
    
    // Create item in database
    const item = await db.items.create(validated);
    
    // Revalidate with stale-while-revalidate
    revalidateTag('items', 'max');
    
    return {
      success: true,
      data: { id: item.id },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    
    console.error('Create error:', error);
    return {
      success: false,
      error: 'Failed to create item',
    };
  }
}

// UPDATE ACTION (with immediate consistency)
export async function updateItem(
  input: UpdateInput
): Promise<ActionResult> {
  try {
    // Validate input
    const validated = UpdateSchema.parse(input);
    
    // Update item in database
    const updated = await db.items.update(validated.id, {
      title: validated.title,
      description: validated.description,
      category: validated.category,
    });
    
    if (!updated) {
      return {
        success: false,
        error: 'Item not found',
      };
    }
    
    // Use updateTag for read-your-writes semantics
    // User sees their changes immediately
    updateTag(`item-${validated.id}`);
    
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    
    console.error('Update error:', error);
    return {
      success: false,
      error: 'Failed to update item',
    };
  }
}

// DELETE ACTION
export async function deleteItem(id: string): Promise<ActionResult> {
  try {
    const deleted = await db.items.delete(id);
    
    if (!deleted) {
      return {
        success: false,
        error: 'Item not found',
      };
    }
    
    // Revalidate list
    revalidateTag('items', 'max');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'Failed to delete item',
    };
  }
}

// TOGGLE ACTION (with optimistic updates)
export async function toggleItemStatus(
  id: string,
  status: boolean
): Promise<ActionResult> {
  try {
    await db.items.update(id, { active: !status });
    
    // Use updateTag for immediate consistency
    updateTag(`item-${id}`);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Toggle error:', error);
    return {
      success: false,
      error: 'Failed to toggle status',
    };
  }
}

// BATCH ACTION
export async function batchDeleteItems(
  ids: string[]
): Promise<ActionResult<{ deleted: number }>> {
  try {
    const deleted = await db.items.deleteMany(ids);
    
    revalidateTag('items', 'max');
    
    return {
      success: true,
      data: { deleted },
    };
  } catch (error) {
    console.error('Batch delete error:', error);
    return {
      success: false,
      error: 'Failed to delete items',
    };
  }
}

// ACTION WITH REDIRECT
export async function createAndRedirect(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
    };
    
    const validated = CreateSchema.parse(rawData);
    const item = await db.items.create(validated);
    
    revalidateTag('items', 'max');
    
    // Redirect after successful creation
    redirect(`/items/${item.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    
    console.error('Create error:', error);
    return {
      success: false,
      error: 'Failed to create item',
    };
  }
}

// ACTION WITH REVALIDATE PATH
export async function updateAndRevalidatePath(
  id: string,
  data: Partial<CreateInput>
): Promise<ActionResult> {
  try {
    await db.items.update(id, data);
    
    // Revalidate entire path
    revalidatePath('/items');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Update error:', error);
    return {
      success: false,
      error: 'Failed to update item',
    };
  }
}

// Mock database - replace with your actual database
const db = {
  items: {
    async create(data: CreateInput) {
      // Implement database creation
      return { id: 'new-id', ...data };
    },
    async update(id: string, data: Partial<CreateInput>) {
      // Implement database update
      return { id, ...data };
    },
    async delete(id: string) {
      // Implement database deletion
      return true;
    },
    async deleteMany(ids: string[]) {
      // Implement batch deletion
      return ids.length;
    },
  },
};
