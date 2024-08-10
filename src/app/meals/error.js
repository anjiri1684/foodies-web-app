"use client";

export default function Error({ error }) {
  return (
    <main className="errror">
      <h1>An error occured!</h1>
      <p>Failed to fetch meals data. Please try again later</p>
    </main>
  );
}
