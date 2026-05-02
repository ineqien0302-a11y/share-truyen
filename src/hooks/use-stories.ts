import { useQuery } from "@tanstack/react-query";
import { mockStories, mockChapters, type Story, type Chapter } from "@/lib/mock-data";

export function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockStories].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    },
  });
}

export function useStory(id: string | undefined) {
  return useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      if (!id) return null;
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStories.find((s) => s.id === id) || null;
    },
    enabled: !!id,
  });
}

export function useChapters(storyId: string | undefined) {
  return useQuery({
    queryKey: ["chapters", storyId],
    queryFn: async () => {
      if (!storyId) return [];
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockChapters[storyId] || [];
    },
    enabled: !!storyId,
  });
}

export function useChapter(storyId: string | undefined, chapterNum: number) {
  return useQuery({
    queryKey: ["chapter", storyId, chapterNum],
    queryFn: async () => {
      if (!storyId) return null;
      await new Promise((resolve) => setTimeout(resolve, 300));
      const chapters = mockChapters[storyId] || [];
      return chapters.find((c) => c.chapter_number === chapterNum) || null;
    },
    enabled: !!storyId && chapterNum > 0,
  });
}

export function useStoriesByAuthor(authorName: string | undefined) {
  return useQuery({
    queryKey: ["stories-by-author", authorName],
    queryFn: async () => {
      if (!authorName) return [];
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStories
        .filter((s) => s.author === authorName)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    },
    enabled: !!authorName,
  });
}
