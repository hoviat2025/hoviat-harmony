import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center glass-static rounded-2xl p-12 animate-scale-in max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">۴۰۴</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          صفحه یافت نشد
        </h1>
        <p className="text-silver mb-8">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
        </p>
        <Link to="/">
          <Button className="gold-shine text-primary-foreground">
            <Home className="w-5 h-5 ml-2" />
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
