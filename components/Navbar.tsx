import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          The Mastas Cup
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/teams" className="hover:underline">Teams</Link>
          <Link href="/schedule" className="hover:underline">Schedule</Link>
          <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          <Link href="/matches" className="hover:underline">Matches</Link>
          <Link href="/rules" className="hover:underline">Rules</Link>
          <Link href="/gallery" className="hover:underline">Gallery</Link>
          <Link href="/scorecards" className="hover:underline">Scorecards</Link>
        </div>
        <div className="md:hidden">
          {/* Mobile menu button - for simplicity, just show links */}
          <div className="flex space-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/teams" className="hover:underline">Teams</Link>
            <Link href="/schedule" className="hover:underline">Schedule</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
            <Link href="/matches" className="hover:underline">Matches</Link>
            <Link href="/rules" className="hover:underline">Rules</Link>
            <Link href="/gallery" className="hover:underline">Gallery</Link>
            <Link href="/scorecards" className="hover:underline">Scorecards</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}