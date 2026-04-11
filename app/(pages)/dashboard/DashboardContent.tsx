import type { Deck } from "@/lib/type";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { Pencil } from "lucide-react";
import DeleteDeckButton from "./DeleteDeckButton";

export default async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const decks: Deck[] = await prisma.decks.findMany({
    where: {
      userId: user?.id,
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {decks.map(deck => (
        <div
          key={deck.id}
          className="group bg-white py-4 px-8 rounded-2xl shadow-md border border-white border-4
          hover:-translate-y-1 hover:shadow-xl hover:shadow-xl
          transition duration-300 ease-out"
          
        >
          <header className="flex items-center justify-between gap-2">
            <p className="text-2xl truncate flex-1 min-w-0 font-semibold">
              {deck.name}
            </p>
            <div className="hidden group-hover:flex items-center shrink-0">
              <button
                className="text-gray-400 mr-6 hover:text-black hover:cursor-pointer"
              >
                <Pencil size={17}/>
              </button>
              <DeleteDeckButton id={deck.id} />
            </div>
          </header>
        </div>
      ))}
    </div>
  )
}
// import { prisma } from "@/lib/prisma/prisma";
// import { createClient } from "@/lib/supabase/server";
// import { Pencil } from "lucide-react";
// import type { Deck } from "@/lib/type";
//
// const colorAccents = [
//   { bg: "from-violet-50 to-indigo-50", border: "border-violet-100", dot: "bg-violet-400", hover: "group-hover:text-violet-500" },
//   { bg: "from-sky-50 to-cyan-50", border: "border-sky-100", dot: "bg-sky-400", hover: "group-hover:text-sky-500" },
//   { bg: "from-emerald-50 to-teal-50", border: "border-emerald-100", dot: "bg-emerald-400", hover: "group-hover:text-emerald-500" },
//   { bg: "from-amber-50 to-orange-50", border: "border-amber-100", dot: "bg-amber-400", hover: "group-hover:text-amber-500" },
//   { bg: "from-rose-50 to-pink-50", border: "border-rose-100", dot: "bg-rose-400", hover: "group-hover:text-rose-500" },
//   { bg: "from-fuchsia-50 to-purple-50", border: "border-fuchsia-100", dot: "bg-fuchsia-400", hover: "group-hover:text-fuchsia-500" },
// ];
//
// export default async function DashboardContent() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//
//   const decks: Deck[] = await prisma.decks.findMany({
//     where: { userId: user?.id },
//   });
//
//   if (decks.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 text-stone-400">
//         <p className="text-lg font-medium">デッキがありません</p>
//         <p className="text-sm mt-1">左上のボタンからデッキを作成しましょう</p>
//       </div>
//     );
//   }
//
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//       {decks.map((deck, i) => {
//         const accent = colorAccents[i % colorAccents.length];
//         return (
//           <div
//             key={deck.id}
//             className={`
//               group relative bg-gradient-to-br ${accent.bg}
//               border ${accent.border}
//               rounded-2xl p-5 cursor-pointer
//               shadow-sm hover:shadow-lg
//               transition-all duration-300 ease-out
//               hover:-translate-y-1
//             `}
//           >
//             {/* accent dot */}
//             <span className={`
//               inline-block w-2 h-2 rounded-full ${accent.dot} mb-3
//               transition-transform duration-300 group-hover:scale-125
//             `} />
//
//             <div className="flex items-start justify-between gap-2">
//               <h2 className="text-lg font-semibold text-stone-800 leading-snug break-all">
//                 {deck.name}
//               </h2>
//
//               {/* edit button - visible on hover */}
//               <button
//                 className={`
//                   shrink-0 opacity-0 group-hover:opacity-100
//                   transition-all duration-200
//                   p-1.5 rounded-lg hover:bg-white/70
//                   ${accent.hover}
//                 `}
//               >
//                 <Pencil size={15} />
//               </button>
//             </div>
//
//             {/* subtle bottom line */}
//             <div className={`
//               absolute bottom-0 left-5 right-5 h-px
//               bg-gradient-to-r from-transparent via-stone-200 to-transparent
//               opacity-0 group-hover:opacity-100 transition-opacity duration-300
//             `} />
//           </div>
//         );
//       })}
//     </div>
//   );
// }
