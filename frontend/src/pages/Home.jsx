import { useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/playtube1.png";
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import Profile from "../component/Profile";
import { useSelector } from "react-redux";
import AllVideosPage from "../component/AllVideosPage";
import ShortsPage from "../component/ShortsPage";
import CustomAlert from "../component/CustomAlert";
import { serverUrl } from "../App";
import axios from "axios";
import SearchResults from "./SearchResults";
import { ClipLoader } from "react-spinners";
import FilterResults from "./FilterResult";
import RecommendationContent from "./RecommendationContent";
import UseGetSubscribedContent from "../customHooks/UseGetSubscribedContent";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { userData, subscribeChannel } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", "Music", "Gaming", "Movies", "TV Shows", "News",
    "Trending", "Entertainment", "Education", "Science & Tech",
    "Travel", "Fashion", "Cooking", "Sports", "Pets",
    "Art", "Comedy", "Vlogs"
  ];

  // 🔊 Speech synthesis
  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  // 🎤 Speech recognition
  const recognitionRef = useRef(null);
  if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

  }

  const handleSearch = async () => {
    if (!recognitionRef.current) {
      CustomAlert("Speech recognition not supported in your browser");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setListening(true);
    recognitionRef.current.start();

    recognitionRef.current.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      setListening(false);
      await handleSearchData(transcript);
    };

    recognitionRef.current.onerror = (err) => {
      console.error("Recognition error:", err);
      setListening(false);

      if (err.error === "no-speech") {
        setAlertMessage("No speech detected. Please try again.");
      } else {
        setAlertMessage("Voice search failed. Try again.");
      }
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };
  };

  const handleSearchData = async (query) => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/content/search",
        { input: query },
        { withCredentials: true }
      );
      setSearchData(result.data);
      console.log(result.data);
      navigate("/")
      setInput("");
      setPopUp(false);
      setLoading(false);

      const { videos = [], shorts = [], playlists = [], channels = [] } = result.data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results I found for you");
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.error(error);
      setPopUp(false);
      setLoading(false);
    }
  };
  const handleCategoryFilter = async (category) => {
    setLoading1(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/content/filter",
        { input: category },
        { withCredentials: true }
      );

      const { videos = [], shorts = [], channels = [] } = result.data;

      // ✅ Channels ke videos aur shorts merge karo
      let channelVideos = [];
      let channelShorts = [];
      channels.forEach((ch) => {
        if (ch.videos?.length) channelVideos.push(...ch.videos);
        if (ch.shorts?.length) channelShorts.push(...ch.shorts);
      });

      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      setLoading1(false)
      navigate("/")

      console.log("Category filter merged:", {
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });



      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are some ${category} videos and shorts for you`);
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.error("Category filter error:", error);
      setLoading1(false)

    }
  };

  UseGetSubscribedContent()
  

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative font-sans">
      {/* 🎤 Voice Search Modal (Clean YouTube Style - No Glassmorphism) */}
      {popUp && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[#212121] border border-[#333333] rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col items-center justify-between min-h-[360px]">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-[#333]"
              onClick={() => {
                if (listening && recognitionRef.current) recognitionRef.current.stop();
                setListening(false);
                setPopUp(false);
              }}
            >
              <FaTimes size={18} />
            </button>

            {/* Header info */}
            <div className="w-full text-center mt-2">
              <h2 className="text-xl font-medium text-[#f1f1f1]">
                {listening ? "Listening..." : "Search with your voice"}
              </h2>
              {input && (
                <p className="mt-4 text-lg text-white font-medium bg-[#2a2a2a] px-4 py-2 rounded-xl">
                  {input}
                </p>
              )}
            </div>

            {/* Mic button */}
            <div className="my-6">
              <button
                className={`p-7 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shadow-lg ${
                  listening
                    ? "bg-[#ff0000] text-white ring-8 ring-red-500/20 scale-105"
                    : "bg-[#272727] hover:bg-[#383838] text-white"
                }`}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={28} color="white" />
                ) : (
                  <FaMicrophone size={26} />
                )}
              </button>
            </div>

            {/* Subtext */}
            <p className="text-xs text-gray-400 text-center">
              Tap the microphone to speak
            </p>
          </div>
        </div>
      )}

      {/* ---------- NAVBAR ---------- */}
      <header className="bg-[#0f0f0f] h-14 px-4 border-b border-[#272727] fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white hover:bg-[#272727] rounded-full transition-colors cursor-pointer text-lg hidden md:flex items-center justify-center"
            title="Guide"
          >
            <FaBars />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => {
              setSelectedCategory("All");
              setFilterData(null);
              setSearchData(null);
              navigate("/");
            }}
          >
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            <span className="text-white font-bold text-lg tracking-tight font-roboto">
              OpenTube
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-4">
          <div className="flex items-center w-full max-w-xl">
            <div className="flex items-center flex-1 bg-[#121212] border border-[#303030] focus-within:border-[#1c62b9] rounded-l-full px-4 py-2 transition-colors">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-[#f1f1f1] placeholder-[#888888] outline-none text-[15px]"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchData(input);
                }}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="text-gray-400 hover:text-white mr-1 text-sm cursor-pointer"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              className="bg-[#222222] hover:bg-[#272727] px-6 py-2.5 rounded-r-full border border-l-0 border-[#303030] text-gray-300 hover:text-white cursor-pointer transition-colors flex items-center justify-center"
              onClick={() => handleSearchData(input)}
              disabled={loading}
              title="Search"
            >
              {loading ? <ClipLoader size={16} color="white" /> : <FaSearch size={15} />}
            </button>
          </div>
          <button
            className="ml-3 p-2.5 bg-[#222222] hover:bg-[#272727] text-white rounded-full cursor-pointer transition-colors flex items-center justify-center flex-shrink-0"
            onClick={() => setPopUp(true)}
            title="Search with your voice"
          >
            <FaMicrophone size={15} />
          </button>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userData?.channel && (
            <button
              className="hidden md:flex items-center gap-1.5 bg-[#272727] hover:bg-[#383838] px-3.5 py-1.5 rounded-full text-sm font-medium text-white transition-colors cursor-pointer"
              onClick={() => navigate("/createpage")}
            >
              <span className="text-base font-light">+</span>
              <span>Create</span>
            </button>
          )}

          {/* Mobile search trigger */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white text-base cursor-pointer"
            onClick={() => setPopUp(true)}
          >
            <FaSearch />
          </button>

          {/* User Profile Trigger */}
          {userData?.photoUrl ? (
            <img
              src={userData?.photoUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#444] cursor-pointer hover:ring-2 hover:ring-white/20 transition-all"
              onClick={() => setOpen((prev) => !prev)}
            />
          ) : (
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] hover:bg-[#3ea6ff]/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
            >
              <FaUserCircle size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </header>

      {/* ---------- SIDEBAR ---------- */}
      <aside
        className={`bg-[#0f0f0f] border-r border-[#272727] transition-all duration-200 fixed top-14 bottom-0 z-40
          ${sidebarOpen ? "w-60 px-3" : "w-[72px] px-1"} hidden md:flex flex-col overflow-y-auto scrollbar-none`}
      >
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHome />}
            text="Home"
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              setSelectedCategory("All");
              setFilterData(null);
              setSearchData(null);
              navigate("/");
            }}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscribepage");
            }}
          />
        </nav>

        <hr className="border-[#272727] my-3" />

        {sidebarOpen && (
          <p className="text-[14px] font-semibold text-[#f1f1f1] px-3 py-1">You</p>
        )}
        <nav className="space-y-1 mt-1">
          <SidebarItem
            icon={<FaHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SidebarItem
            icon={<FaList />}
            text="Playlists"
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              setSelectedItem("Playlists");
              navigate("/saveplaylist");
            }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Saved videos"
            open={sidebarOpen}
            selected={selectedItem === "Saved videos"}
            onClick={() => {
              setSelectedItem("Saved videos");
              navigate("/savevideos");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked videos"}
            onClick={() => {
              setSelectedItem("Liked videos");
              navigate("/likedvideos");
            }}
          />
        </nav>

        {sidebarOpen && subscribeChannel && subscribeChannel.length > 0 && (
          <>
            <hr className="border-[#272727] my-3" />
            <p className="text-[14px] font-semibold text-[#f1f1f1] px-3 py-1">Subscriptions</p>
            <nav className="space-y-1 mt-1 pb-4">
              {subscribeChannel.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedItem(item._id);
                    navigate(`/channelpage/${item._id}`);
                  }}
                  className={`flex items-center gap-3.5 w-full text-left cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                    selectedItem === item._id ? "bg-[#272727]" : "hover:bg-[#272727]"
                  }`}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-6 h-6 rounded-full border border-[#333] object-cover flex-shrink-0"
                  />
                  <span className="text-[14px] text-[#f1f1f1] truncate">{item.name}</span>
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <main
        className={`overflow-y-auto px-4 sm:px-6 py-3 flex flex-col pb-20 transition-all duration-200 ${
          sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
        }`}
      >
        {location.pathname === "/" && (
          <>
            {/* Category Pills Bar */}
            <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pt-2 mt-14 pb-2 sticky top-14 bg-[#0f0f0f] z-30">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-sm transition-colors cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? "bg-[#f1f1f1] text-[#0f0f0f] font-semibold"
                      : "bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]"
                  }`}
                  disabled={loading1}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat === "All") {
                      setFilterData(null);
                      setSearchData(null);
                    } else {
                      handleCategoryFilter(cat);
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Feed */}
            <div className="mt-5">
              {loading1 && (
                <div className="w-full flex items-center justify-center py-10">
                  <ClipLoader size={40} color="white" />
                </div>
              )}

              {searchData && <SearchResults searchResults={searchData} />}
              {filterData && <FilterResults filterResults={filterData} />}

              {!searchData && !filterData && (
                userData ? (
                  <RecommendationContent />
                ) : (
                  <>
                    <AllVideosPage />
                    <ShortsPage />
                  </>
                )
              )}
            </div>
          </>
        )}

        {open && <Profile />}
        <div className="mt-14">
          <Outlet />
        </div>
      </main>

      {/* ---------- BOTTOM NAV (MOBILE) ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-[#272727] flex justify-around py-2 z-40">
        <MobileNavItem
          onClick={() => {
            setSelectedCategory("All");
            setFilterData(null);
            setSearchData(null);
            navigate("/");
          }}
          icon={<FaHome />}
          text="Home"
          active={location.pathname === "/"}
        />
        <MobileNavItem
          onClick={() => navigate("/shorts")}
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={location.pathname === "/shorts"}
        />
        <MobileNavItem
          onClick={() => navigate("/createpage")}
          icon={<IoIosAddCircle className="text-3xl text-gray-300" />}
          text=""
        />
        <MobileNavItem
          onClick={() => navigate("/subscribepage")}
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={location.pathname === "/subscribepage"}
        />
        <MobileNavItem
          onClick={() => navigate("/mobileprofile")}
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData?.photoUrl}
                className="w-6 h-6 rounded-full object-cover border border-gray-700"
                alt="user"
              />
            )
          }
          text="You"
          active={location.pathname === "/mobileprofile"}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, open, selected, onClick }) {
  if (!open) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-xl transition-colors cursor-pointer w-full gap-1.5 ${
          selected
            ? "bg-[#272727] text-white font-semibold"
            : "hover:bg-[#272727] text-[#f1f1f1]"
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] tracking-tight">{text}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-6 px-3 py-2.5 rounded-xl w-full text-left transition-colors cursor-pointer ${
        selected
          ? "bg-[#272727] text-white font-semibold"
          : "hover:bg-[#272727] text-[#f1f1f1]"
      }`}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <span className="text-[14px] truncate">{text}</span>
    </button>
  );
}

function MobileNavItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
        active ? "text-white font-medium" : "text-gray-400"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {text && <span className="text-[10px]">{text}</span>}
    </button>
  );
}

export default Home;
