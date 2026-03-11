import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CVBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', email: '', phone: '', address: '',
    summary: '', experience: '', education: '', skills: ''
  });
  const navigate = useNavigate();

  const steps = [
    { title: "Contact Info", fields: ['name', 'email', 'phone', 'address'] },
    { title: "Professional Summary", fields: ['summary'] },
    { title: "Experience & Education", fields: ['experience', 'education'] },
    { title: "Skills", fields: ['skills'] }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Advanced CV Builder</h1>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {steps.map((s, i) => (
          <div 
            key={i}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${step === i ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/40'}`}
          >
            {s.title}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {steps[step].fields.map(field => (
          <div key={field} className="space-y-2">
            <label className="text-sm text-white/50 capitalize">{field}</label>
            {field === 'summary' || field === 'experience' || field === 'education' || field === 'skills' ? (
              <textarea
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={(data as any)[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
              />
            ) : (
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={(data as any)[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
              />
            )}
          </div>
        ))}

        <div className="flex justify-between pt-4">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-8 py-4 rounded-2xl bg-white/5 font-bold">Back</button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="ml-auto px-8 py-4 rounded-2xl bg-indigo-500 font-bold">Next</button>
          ) : (
            <button className="ml-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold flex items-center gap-2">
              <Download size={20} /> Export PDF
            </button>
          )}
        </div>
      </div>

      {step === steps.length - 1 && (
        <div className="mt-12 p-8 bg-white text-slate-900 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center border-b pb-6">
            <h2 className="text-3xl font-bold uppercase tracking-wider">{data.name || 'Your Name'}</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Mail size={14} /> {data.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {data.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {data.address}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-bold border-b-2 border-slate-900 mb-2 flex items-center gap-2">
                <User size={18} /> SUMMARY
              </h3>
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </section>
            
            <section>
              <h3 className="text-lg font-bold border-b-2 border-slate-900 mb-2 flex items-center gap-2">
                <Briefcase size={18} /> EXPERIENCE
              </h3>
              <p className="text-sm whitespace-pre-wrap">{data.experience}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold border-b-2 border-slate-900 mb-2 flex items-center gap-2">
                <GraduationCap size={18} /> EDUCATION
              </h3>
              <p className="text-sm whitespace-pre-wrap">{data.education}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
