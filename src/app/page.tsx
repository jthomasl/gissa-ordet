// Gissa Ordet — svenskt ordgissningsspel
"use client";

import { useState, useEffect, useCallback } from "react";
import { getRandomWord, WORDS } from "./words";

const MAX_GUESSES = 10;
const WORD_LENGTH = 5;

// Bestäm färg för varje bokstav: grön = rätt plats, gul = finns men fel plats, grå = finns inte
type LetterStatus = "correct" | "present" | "absent" | "empty";

interface LetterResult {
  letter: string;
  status: LetterStatus;
}

function evaluateGuess(guess: string, answer: string): LetterResult[] {
  const results: LetterResult[] = Array(WORD_LENGTH).fill(null).map((_, i) => ({
    letter: guess[i],
    status: "absent" as LetterStatus,
  }));

  // Håll koll på vilka bokstäver i svaret som redan "använts"
  const answerLetters = answer.split("");
  const used = Array(WORD_LENGTH).fill(false);

  // Steg 1: markera gröna (rätt plats)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      results[i].status = "correct";
      used[i] = true;
    }
  }

  // Steg 2: markera gula (finns men fel plats)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (results[i].status === "correct") continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guess[i] === answerLetters[j]) {
        results[i].status = "present";
        used[j] = true;
        break;
      }
    }
  }

  return results;
}

// Konfetti-partikel
function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#22c55e", "#eab308", "#3b82f6", "#ec4899", "#f97316"][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<LetterResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [message, setMessage] = useState("");

  // Välj ett nytt ord när spelet startar
  useEffect(() => {
    setAnswer(getRandomWord());
  }, []);

  // Starta om spelet
  function resetGame() {
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setWon(false);
    setMessage("");
  }

  // Hantera knapptryck
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          setShaking(true);
          setMessage("Ordet måste vara 5 bokstäver");
          setTimeout(() => { setShaking(false); setMessage(""); }, 1000);
          return;
        }

        const result = evaluateGuess(currentGuess, answer);
        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);
        setCurrentGuess("");

        // Kolla om spelaren vann
        if (currentGuess === answer) {
          setWon(true);
          setGameOver(true);
          return;
        }

        // Kolla om alla försök är slut
        if (newGuesses.length >= MAX_GUESSES) {
          setGameOver(true);
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < WORD_LENGTH && /^[A-ZÅÄÖ]$/.test(key)) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, guesses, answer, gameOver]
  );

  // Lyssna på tangentbordet
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE") {
        handleKeyPress(key);
      } else if (/^[A-ZÅÄÖ]$/i.test(e.key)) {
        handleKeyPress(key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyPress]);

  // Samla ihop status för tangentbordets färger
  const keyStatuses: Record<string, LetterStatus> = {};
  guesses.forEach((guess) => {
    guess.forEach(({ letter, status }) => {
      const current = keyStatuses[letter];
      if (status === "correct") keyStatuses[letter] = "correct";
      else if (status === "present" && current !== "correct") keyStatuses[letter] = "present";
      else if (!current) keyStatuses[letter] = status;
    });
  });

  // Färgkarta
  function statusColor(status: LetterStatus): string {
    switch (status) {
      case "correct": return "bg-green-600 border-green-600";
      case "present": return "bg-yellow-500 border-yellow-500";
      case "absent": return "bg-[#3a3a3c] border-[#3a3a3c]";
      default: return "bg-transparent border-[#565656]";
    }
  }

  function keyColor(letter: string): string {
    const status = keyStatuses[letter];
    switch (status) {
      case "correct": return "bg-green-600";
      case "present": return "bg-yellow-500";
      case "absent": return "bg-[#3a3a3c]";
      default: return "bg-[#818384]";
    }
  }

  // Tangentbordslayout
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-2 py-4 select-none">
      {/* Konfetti vid vinst */}
      {won && <Confetti />}

      {/* Titel */}
      <h1 className="text-3xl font-bold tracking-wider mb-1">GISSA ORDET</h1>
      <p className="text-[#818384] text-sm mb-4">
        {MAX_GUESSES - guesses.length} försök kvar
      </p>

      {/* Meddelande */}
      {message && (
        <div className="bg-white text-black font-bold px-4 py-2 rounded-lg mb-2 text-sm">
          {message}
        </div>
      )}

      {/* Grattis-meddelande */}
      {won && (
        <div className="animate-bounce-in text-center mb-4">
          <div className="text-6xl mb-2">🎉</div>
          <div className="text-2xl font-bold text-green-400">GRATTIS!</div>
          <div className="text-[#818384]">
            Du klarade det på {guesses.length} {guesses.length === 1 ? "försök" : "försök"}!
          </div>
        </div>
      )}

      {/* Ledsen gubbe vid förlust */}
      {gameOver && !won && (
        <div className="animate-bounce-in text-center mb-4">
          <div className="text-6xl mb-2 animate-sad">😢</div>
          <div className="text-xl font-bold text-red-400">Tyvärr!</div>
          <div className="text-[#818384]">
            Rätt ord var: <span className="text-white font-bold">{answer}</span>
          </div>
        </div>
      )}

      {/* Spelrutnät */}
      <div className={`flex flex-col gap-1.5 mb-4 ${shaking ? "animate-shake" : ""}`}>
        {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
          const guess = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length && !gameOver;

          return (
            <div key={rowIndex} className="flex gap-1.5 justify-center">
              {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                let letter = "";
                let colorClass = "border-2 border-[#3a3a3c]";

                if (guess) {
                  // Redan gissad rad
                  letter = guess[colIndex].letter;
                  colorClass = `border-2 ${statusColor(guess[colIndex].status)} animate-flip`;
                } else if (isCurrentRow) {
                  // Nuvarande rad som spelaren skriver i
                  letter = currentGuess[colIndex] || "";
                  colorClass = letter
                    ? "border-2 border-[#565656]"
                    : "border-2 border-[#3a3a3c]";
                }

                return (
                  <div
                    key={colIndex}
                    className={`w-14 h-14 flex items-center justify-center text-2xl font-bold uppercase rounded ${colorClass}`}
                    style={guess ? { animationDelay: `${colIndex * 0.1}s` } : undefined}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Tangentbord */}
      <div className="flex flex-col gap-1.5 w-full max-w-lg">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((key) => {
              const isSpecial = key === "ENTER" || key === "⌫";
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key === "⌫" ? "BACKSPACE" : key)}
                  className={`${
                    isSpecial ? "px-3 text-xs" : "w-9 sm:w-10"
                  } h-14 rounded font-bold uppercase flex items-center justify-center ${
                    isSpecial ? "bg-[#818384]" : keyColor(key)
                  } hover:opacity-80 active:opacity-60 transition-opacity`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Nytt spel-knapp */}
      {gameOver && (
        <button
          onClick={resetGame}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          Spela igen
        </button>
      )}
    </div>
  );
}
