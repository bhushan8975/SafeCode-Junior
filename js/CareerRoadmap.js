import React from "react";

export default function CareerRoadmap() {
  const steps = [
    { title: "1️⃣ Basics of Networking", desc: "Learn IPs, DNS, firewalls, and packet structure." },
    { title: "2️⃣ OS & Scripting", desc: "Get comfortable with Linux, Python, and Bash scripting." },
    { title: "3️⃣ Security Fundamentals", desc: "Understand cryptography, threats, and vulnerabilities." },
    { title: "4️⃣ Ethical Hacking", desc: "Master reconnaissance, exploitation, and post-exploitation." },
    { title: "5️⃣ Certifications", desc: "Earn CEH, CompTIA Security+, or OSCP for credibility." },
    { title: "6️⃣ Real-World Projects", desc: "Build your own security tools or contribute to open source." },
  ];

  return (
    <div className="roadmap">
      <h2>🧭 Cybersecurity Career Roadmap</h2>
      <div className="roadmap-steps">
        {steps.map((s, i) => (
          <div key={i} className="roadmap-card">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
