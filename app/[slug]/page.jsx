{/* HEADER CARD */}
<div className="rounded-2xl bg-gradient-to-b from-[#0e1625] to-[#0a0f1c] border border-[#1e293b] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
  <div>
    <div className="flex items-center mb-2">
      <div className="w-8 h-8 rounded-full bg-[#63d3e0] flex items-center justify-center mr-3">
        <span className="text-[#0a0f1c] font-bold text-lg">★</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.name}</h1>
    </div>
    <p className="text-sm text-gray-400">{profile.trade} • {profile.city}</p>
  </div>

  <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
    {profile.phone && (
      <a
        href={`tel:${profile.phone}`}
        className="bg-[#63d3e0] hover:bg-[#5bcbd8] text-black font-semibold py-2 px-5 rounded-xl transition"
      >
        Call
      </a>
    )}
    {profile.whatsapp && (
      <a
        href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
        className="bg-[#1f2937] border border-[#2f3c4f] hover:bg-[#273549] text-white font-semibold py-2 px-5 rounded-xl transition"
      >
        WhatsApp
      </a>
    )}
    {profile.email && (
      <a
        href={`mailto:${profile.email}`}
        className="bg-[#1f2937] border border-[#2f3c4f] hover:bg-[#273549] text-white font-semibold py-2 px-5 rounded-xl transition"
      >
        Email
      </a>
    )}
  </div>
</div>
