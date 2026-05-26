import { useEffect } from "react";
import { type Translations, type Lang } from "@/i18n/translations";
import { usePrivateContent, pickLangFeelings } from "@/hooks/usePrivateContent";

interface Props {
  t: Translations;
  lang: Lang;
}

export default function Feelings({ t, lang }: Props) {
  const data = usePrivateContent();
  const feelings = pickLangFeelings(data, lang);

  const heroSub = feelings.heroSub ?? "";
  const storyTitle = feelings.storyTitle ?? "";
  const storyParagraphs = feelings.storyParagraphs ?? [];
  const memoriesTitle = feelings.memoriesTitle ?? "";
  const memoriesSub = feelings.memoriesSub ?? "";
  const memoryFragments = feelings.memoryFragments ?? [];
  const collapseTitle = feelings.collapseTitle ?? "";
  const collapseLines = feelings.collapseLines ?? [];
  const endingLine = feelings.endingLine ?? "";

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${t.feelings_doc_title} · ${t.brand}`;
    return () => { document.title = prevTitle; };
  }, [t.brand, t.feelings_doc_title]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>{t.feelings_doc_title}</h1>
        {heroSub && <p>{heroSub}</p>}
      </div>

      {/* Story paragraphs */}
      {storyParagraphs.length > 0 && (
        <div className="writings-list">
          {storyTitle && (
            <div className="writing-card glass">
              <p style={{ fontStyle: "italic", opacity: 0.7, fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                {storyTitle}
              </p>
            </div>
          )}
          {storyParagraphs.map((para, i) => (
            <div key={i} className="writing-card glass">
              <span className="writing-num">{i + 1}</span>
              <p>{para}</p>
            </div>
          ))}
        </div>
      )}

      {/* Memory fragments */}
      {memoryFragments.length > 0 && (
        <div className="writings-list" style={{ marginTop: "2rem" }}>
          {(memoriesTitle || memoriesSub) && (
            <div className="writing-card glass" style={{ textAlign: "center" }}>
              {memoriesTitle && <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{memoriesTitle}</p>}
              {memoriesSub && <p style={{ opacity: 0.65, fontSize: "0.88rem" }}>{memoriesSub}</p>}
            </div>
          )}
          {memoryFragments.map((m, i) => (
            <div key={i} className="writing-card glass">
              {m.label && (
                <span className="writing-num" style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  {m.label}
                </span>
              )}
              <p>{m.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Collapse lines */}
      {collapseLines.length > 0 && (
        <div className="writings-list" style={{ marginTop: "2rem" }}>
          {collapseTitle && (
            <div className="writing-card glass" style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 600 }}>{collapseTitle}</p>
            </div>
          )}
          {collapseLines.map((line, i) => (
            <div key={i} className="writing-card glass" style={{ textAlign: "center" }}>
              <p style={{ opacity: Math.max(0.4, 1 - i * 0.12) }}>{line}</p>
            </div>
          ))}
        </div>
      )}

      {/* Ending */}
      {endingLine && (
        <div className="farewell-section">
          <div className="farewell-card glass">
            <div className="farewell-divider" />
            {endingLine.split("\n\n").map((paragraph, i) => (
              <p key={i} className="farewell-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
