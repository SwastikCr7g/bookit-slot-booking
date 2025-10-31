"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  slots: { date: string; time: string; available: boolean }[];
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  const loadExperience = () => {
    setLoading(true);
    fetch(`http://192.168.1.35:5000/api/experiences/${id}`)
      .then(res => res.json())
      .then(data => {
        setExperience(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setExperience(null);
      });
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setExperience(null);
      return;
    }
    loadExperience();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  if (!experience || !experience.image || !Array.isArray(experience.slots)) {
    return (
      <div className="p-10 text-center text-red-600">
        Experience not found or data missing from API.<br />
        params: {JSON.stringify(params)}
      </div>
    );
  }

  const availableSlots = experience.slots.filter(slot => slot.available);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg flex flex-col items-center max-w-lg w-full">
        <Image
          src={experience.image}
          alt={experience.title}
          width={320}
          height={180}
          className="rounded-lg object-cover mb-6"
        />
        <h1 className="text-3xl font-bold mb-2 text-center">{experience.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-4">{experience.description}</p>
        <div className="grid grid-cols-1 gap-2 mb-3 w-full">
          {availableSlots.length === 0 && <div className="text-center text-red-500">No slots available</div>}
          {availableSlots.map((slot, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span>{slot.date} — {slot.time}</span>
              <button
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
                onClick={() =>
                  router.push(
                    `/checkout?experienceId=${encodeURIComponent(experience.id)}&date=${encodeURIComponent(slot.date)}&time=${encodeURIComponent(slot.time)}`
                  )
                }
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
