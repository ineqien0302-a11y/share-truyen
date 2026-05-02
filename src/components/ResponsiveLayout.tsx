import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "@/components/MobileLayout";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileContent?: React.ReactNode;
}

/**
 * Renders mobile layout with bottom nav on mobile,
 * or desktop layout (children) on desktop.
 */
export function ResponsiveLayout({ children, mobileContent }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile && mobileContent) {
    return <MobileLayout>{mobileContent}</MobileLayout>;
  }

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <>{children}</>;
}
