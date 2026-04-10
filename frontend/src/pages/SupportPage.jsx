import React, { useState } from "react";
import FeedbackForm from "../components/FeedbackForm.jsx";
import ComplaintForm from "../components/ComplaintForm.jsx";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("feedback");

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-[#0056D2]/20 bg-white/85 p-6 shadow-[0_24px_70px_-38px_rgba(0,86,210,0.55)] backdrop-blur-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-[#0056D2]/25 bg-[#0056D2]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#0056D2]">
                QUICKBITE SUPPORT
              </span>
              <h1 className="text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
                We are here to fix issues fast and improve every canteen
                experience.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
                Choose feedback to share ideas, or complaint to report a
                problem. Our team reviews each submission and follows up
                quickly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#0056D2]/20 bg-[#0056D2]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">
                  Response Target
                </p>
                <p className="mt-2 text-xl font-bold text-[#0056D2]">
                  Within 24h
                </p>
              </div>
              <div className="rounded-2xl border border-[#FF7A00]/35 bg-[#FF7A00]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">
                  Support Channels
                </p>
                <p className="mt-2 text-xl font-bold text-[#A93802]">
                  Feedback + Complaints
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#e2e8f0] bg-white/90 p-4 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.45)] sm:p-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("feedback")}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "feedback"
                  ? "bg-[#0056D2] text-white shadow-[0_10px_28px_-14px_rgba(0,86,210,0.8)]"
                  : "border border-[#0056D2]/20 bg-white text-[#0056D2] hover:border-[#0056D2]/40 hover:bg-[#0056D2]/10"
              }`}
              type="button"
            >
              Give Feedback
            </button>
            <button
              onClick={() => setActiveTab("complaint")}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "complaint"
                  ? "bg-[#FF7A00] text-white shadow-[0_10px_28px_-14px_rgba(255,122,0,0.9)]"
                  : "border border-[#FF7A00]/30 bg-white text-[#A93802] hover:border-[#FF7A00]/45 hover:bg-[#FF7A00]/10"
              }`}
              type="button"
            >
              Make Complaint
            </button>
          </div>

          <div className="mb-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
            {activeTab === "feedback" && (
              <div>
                <h3 className="text-lg font-bold text-[#0056D2]">Feedback</h3>
                <p className="mt-1 text-sm text-[#475569]">
                  Tell us what is working and what can be improved. Your ideas
                  help us shape better food quality, speed, and service.
                </p>
              </div>
            )}

            {activeTab === "complaint" && (
              <div>
                <h3 className="text-lg font-bold text-[#A93802]">Complaint</h3>
                <p className="mt-1 text-sm text-[#475569]">
                  Report an issue with details so our support team can
                  investigate quickly and resolve it with priority.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-2 sm:p-4">
            {activeTab === "feedback" && <FeedbackForm />}
            {activeTab === "complaint" && <ComplaintForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
