import { Icon } from "@iconify/react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Icon
        icon="line-md:loading-twotone-loop"
        className="w-12 h-12 text-blue-500"
      />
    </div>
  );
};

export default LoadingSpinner;
