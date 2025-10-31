'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  basePrice: number;
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const experienceId = searchParams.get("experienceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [experience, setExperience] = useState<Experience | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!experienceId) return;
    fetch(`http://192.168.1.35:5000/api/experiences/${experienceId}`)
      .then(res => res.json())
      .then(data => {
        setExperience(data);
        setPrice(data.basePrice);
      });
  }, [experienceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("http://192.168.1.35:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId,
        slot: { date, time },
        name,
        email,
        promoCode,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      router.push(`/result?success=1&discount=${data.discount ?? 0}`);
    } else {
      router.push(`/result?success=0&error=${encodeURIComponent(data.error || 'Unknown error')}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg max-w-lg w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        {experience && (
          <>
            <Image src={experience.image} alt={experience.title} width={320} height={180} className="rounded mb-3" />
            <div className="font-semibold">{experience.title}</div>
            <div className="text-gray-600 mb-4">{experience.description}</div>
          </>
        )}
        <div className="mb-2 font-medium">
          Slot: {date} {time}
        </div>
        <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
          <input
            className="p-2 border rounded"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="p-2 border rounded"
            placeholder="Promo code (optional)"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
          />
          <div className="font-semibold text-right">Price: ₹{price ?? "--"}</div>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </main>
    </div>
  );
}
