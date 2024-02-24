import { useState } from "react";
import { useForm } from "react-hook-form";

const SessionSearch = () => {
  const { register, handleSubmit } = useForm();
  const [searchResults, setSearchResults] = useState(null);

  const onSubmit = async (data) => {
    console.log(data);
    const resp = await fetch(
      `http://localhost:8080/session/search?${new URLSearchParams(data)}`,
    );
    if (resp.ok) {
      const data = await resp.json();
      console.log(data)
      setSearchResults(data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username", { required: true })} />
        <input {...register("date_range_begin")} />
        <input {...register("date_range_end")} />
        <button type="submit">search</button>
      </form>
      {searchResults === null ? null : searchResults}
    </div>
  );
};

const App = () => {
  return (
    <main>
      <SessionSearch />
    </main>
  );
};

export default App;
