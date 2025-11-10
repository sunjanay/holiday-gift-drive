/**
 * Next.js 16 Route Handler Template
 * 
 * API route with GET, POST, PUT, DELETE methods
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const RequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // Add more fields as needed
});

type RequestBody = z.infer<typeof RequestSchema>;

// GET /api/resource
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    // Fetch data from database
    const data = await fetchData(parseInt(page), parseInt(limit));
    
    return NextResponse.json({
      data,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = RequestSchema.parse(body);
    
    // Create resource
    const created = await createResource(validated);
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/resource/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validated = RequestSchema.partial().parse(body);
    
    // Update resource
    const updated = await updateResource(id, validated);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/resource/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Delete resource
    const deleted = await deleteResource(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions - implement these based on your database
async function fetchData(page: number, limit: number) {
  // Implement data fetching
  return [];
}

async function createResource(data: RequestBody) {
  // Implement resource creation
  return data;
}

async function updateResource(id: string, data: Partial<RequestBody>) {
  // Implement resource update
  return { id, ...data };
}

async function deleteResource(id: string) {
  // Implement resource deletion
  return true;
}
