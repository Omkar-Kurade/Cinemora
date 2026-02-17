const Pagination = ({
  totalPosts,
  postsPerPages,
  setCurrentPost,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPages); i++) {
    pages.push(i);
  }
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 my-4">
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            className={`
                            /* Base Styles */
                            px-4 py-2 rounded-lg border transition-all duration-300 font-medium text-lg
                            
                            /* Conditional Styles: Active vs Inactive */
                            ${
                              page === currentPage
                                ? "bg-red-600 text-white border-red-600 shadow-lg scale-110"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-red-600 hover:border-red-400"
                            }
                        `}
            onClick={() => setCurrentPost(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
