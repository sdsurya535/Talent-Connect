import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
        404
      </h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/admin">
        <Button variant="default">Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
