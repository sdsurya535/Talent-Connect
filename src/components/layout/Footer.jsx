const Footer = () => {
  return (
    <footer className="w-full py-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container px-4 mx-auto">
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} Your App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
