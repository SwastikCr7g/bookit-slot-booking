"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://192.168.1.35:5000/api/experiences")
      .then(res => res.json())
      .then(data => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load API: " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black py-12">
      <main className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-200">
          Travel Experiences
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp: any) => (
            <div
              key={exp.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex flex-col justify-between items-center min-h-[390px]"
            >
              <div className="flex flex-col items-center w-full">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  width={320}
                  height={180}
                  className="rounded-lg object-cover mb-4"
                />
                <h2 className="text-xl font-semibold mb-2 text-center w-full">
                  {exp.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-center w-full">
                  {exp.description}
                </p>
              </div>
              <Link
                href={`/${exp.id}`}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full text-center"
              >
                More Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
