// Define the Blog type
export interface Blog {
    _id: string;
    title: string;
    content: string;
    date: string;
    imageUrl: string;
  }
  
  // Fetch all blogs
  export const fetchBlogs = async (): Promise<Blog[]> => {
    const res = await fetch('/api/blog', { method: 'GET' });
    if (!res.ok) {
      throw new Error('Failed to fetch blogs');
    }
    const blogs = await res.json();
    // Ensure _id is a string (already handled in the API, but added for safety)
    return blogs.map((blog: Partial<Blog>) => ({
      ...blog,
      _id: blog._id?.toString() ?? '',
    }));
  };
  
  // Add a new blog
  export const addBlog = async (blogData: {
    title: string;
    content: string;
    imageUrl: string;
  }): Promise<Blog> => {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
  
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Unauthorized: Please sign in to add a blog');
      }
      if (res.status === 400) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Invalid input');
      }
      throw new Error('Failed to add blog');
    }
  
    const newBlog = await res.json();
    // Ensure _id is a string
    return {
      ...newBlog,
      _id: newBlog._id.toString(),
    };
  };