import React from "react";

const SectionTitle = ({ children }) => (
  <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
    {children}
  </h3>
);

const ResumePreview = ({ resume }) => {
  return (
    <div className="text-gray-800 text-sm leading-relaxed">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{resume.name}</h1>
        <p className="text-gray-600 font-medium">{resume.role}</p>

        <p className="text-xs text-gray-600 mt-2">
          {resume.email} | {resume.phone} | {resume.address}
        </p>

        {resume.linkedin && (
          <p className="text-xs text-blue-600">{resume.linkedin}</p>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <SectionTitle>Summary</SectionTitle>
          <p>{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Skills</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <li
                key={i}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Education</SectionTitle>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-xs text-gray-600">
                {edu.institute} • {edu.year}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Experience</SectionTitle>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">
                {exp.role} — {exp.company}
              </p>
              <p className="text-xs text-gray-600">{exp.duration}</p>
              <p className="mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Projects</SectionTitle>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">{proj.title}</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="list-disc list-inside">
            {resume.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* References */}
      {resume.references && (
        <div className="mb-5">
          <SectionTitle>References</SectionTitle>
          <p>{resume.references}</p>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
