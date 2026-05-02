import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import StoryDetail from "./pages/StoryDetail";
import Reader from "./pages/Reader";
import Auth from "./pages/Auth";
import AuthorProfile from "./pages/AuthorProfile";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Rankings from "./pages/Rankings";
import Achievements from "./pages/Achievements";
import AuthorDashboard from "./pages/AuthorDashboard";
import StoryEditor from "./pages/StoryEditor";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import Genres from "./pages/Genres";
import Community from "./pages/Community";
import Contest from "./pages/Contest";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/read/:storyId/:chapterNum" element={<Reader />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/author/:authorName" element={<AuthorProfile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/dashboard" element={<AuthorDashboard />} />
            <Route path="/editor/:id" element={<StoryEditor />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contest" element={<Contest />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
