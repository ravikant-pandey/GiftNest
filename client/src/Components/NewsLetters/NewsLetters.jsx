function NewsLetters() {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-700">
        Subscribe now & get 20% off on your first order
      </p>
      <p className="text-gray-400 nt-3">
        Join our newsletter and take 20% off your first purchase—just for
        signing up.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          className=" uppercase bg-black text-white text-xs px-10 py-4 rounded"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default NewsLetters;
