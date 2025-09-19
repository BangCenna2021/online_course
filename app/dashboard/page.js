"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  faChartBar,
  faUsers,
  faCog,
  faFileAlt,
  faStar,
  faComments,
  faBook,
  faQuestionCircle,
  faCheck,
  faPenToSquare,
  faTrashAlt,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeTabQuestion, setActiveTabQuestion] = useState("allquestion");
  const [activeTabStudent, setActiveTabStudent] = useState("allStudent");
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [kategori, setKategori] = useState("");
  const [lPart, setLpart] = useState("");
  const [tipe, setTipe] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioUrlPartB, setAudioUrlPartB] = useState(null);
  const [audioFilePartB, setAudioFilePartB] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [sentence, setSentence] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionsLscq, setOptionsLscq] = useState({
    a: "",
    b: "",
    c: "",
    d: "",
    question: "",
  });
  const [selectedLscq, setSelectedLscq] = useState("");
  const [isValidLscq, setIsValidLscq] = useState(false);
  const [showModalLpartA, setShowModalLpartA] = useState(false);
  const [questionsLpartA, setQuestionsLpartA] = useState([]);
  const [showModalLpartB, setShowModalLpartB] = useState(false);
  const [questionsLpartB, setQuestionsLpartB] = useState([]);
  const [showModalS, setShowModalS] = useState(false);
  const [questionsS, setQuestionsS] = useState([]);
  const [questionsW, setQuestionsW] = useState([]);
  const [prevKategori, setPrevKategori] = useState("");
  const [prevLpart, setPrevLpart] = useState("");
  const [prevTipe, setPrevTipe] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValidQuestion, setIsValidQuestion] = useState(false);

  const handleEditorInput = () => {
    const editor = document.getElementById("editor");
    setSentence(editor.innerHTML);
  };

  const handleOptionSelect = (key) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return;

    setOptions((prev) => ({ ...prev, [key]: selectedText }));

    const underline = document.createElement("u");
    underline.textContent = selectedText;

    range.deleteContents();
    range.insertNode(underline);

    const editor = document.getElementById("editor");
    setSentence(editor.innerHTML);

    selection.removeAllRanges();
  };

  const resetEditor = () => {
    setSentence("");
    setOptions({ a: "", b: "", c: "", d: "" });
    setCorrectAnswer("");

    const editor = document.getElementById("editor");
    if (editor) {
      editor.innerHTML = editor.innerHTML.replace(/<\/?u>/g, "");
      setSentence(editor.innerHTML);
    }
  };

  const isValid =
    sentence.trim() !== "" &&
    Object.values(options).every((val) => val.trim() !== "") &&
    correctAnswer.trim() !== "";

  const handleKategoriChange = (e) => {
    const newValue = e.target.value;

    if (questionsLpartA.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartA([]);
          setKategori(newValue);
          setPrevKategori(newValue);
          renderSoal(null);
          setTipe("");
          setLpart("");
          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setKategori(prevKategori);
        }
      });
    } else if (questionsLpartB.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartB([]);
          setKategori(newValue);
          setPrevKategori(newValue);
          renderSoal(null);
          setTipe("");
          setAudioUrlPartB(null);
          setLpart("");
          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setKategori(prevKategori);
        }
      });
    } else {
      setKategori(newValue);
      setPrevKategori(newValue);
      renderSoal(null);
      setTipe("");
      setLpart("");
    }
  };

  const handleLpartChange = (e) => {
    const newValue = e.target.value;

    if (questionsLpartA.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartA([]);
          setLpart(newValue);
          setTipe("");
          setPrevLpart(newValue);

          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setLpart(prevLpart);
        }
      });
    } else if (questionsLpartB.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartB([]);
          setLpart(newValue);
          setTipe("");
          setPrevLpart(newValue);
          setAudioUrlPartB(null);

          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setLpart(prevLpart);
        }
      });
    } else {
      setLpart(newValue);
      setPrevLpart(newValue);
      setTipe("");
    }
  };

  const handleTipeChange = (e) => {
    const newValue = e.target.value;

    if (questionsLpartA.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartA([]);
          setTipe(newValue);
          setPrevTipe(newValue);
          renderTipeInput();
          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setTipe(prevTipe);
        }
      });
    } else if (questionsLpartB.length > 0) {
      Swal.fire({
        title: "Data masih ada di tabel",
        text: "Apakah Anda ingin menghapus semua data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestionsLpartB([]);
          setTipe(newValue);
          setPrevTipe(newValue);
          renderTipeInput();
          setAudioUrlPartB(null);
          Swal.fire("Terhapus!", "Semua data telah dihapus.", "success");
        } else {
          setTipe(prevTipe);
        }
      });
    } else {
      setTipe(newValue);
      setPrevTipe(newValue);
    }
  };

  const handleSaveQuestionLpartA = () => {
    const newQuestion = {
      sound: audioUrl,
      a: optionsLscq.a,
      b: optionsLscq.b,
      c: optionsLscq.c,
      d: optionsLscq.d,
      answer: selectedLscq,
    };

    setQuestionsLpartA((prev) => [...prev, newQuestion]);

    setShowModalLpartA(false);
    setOptionsLscq({ a: "", b: "", c: "", d: "", question: "" });
    setSelectedLscq("");
    setAudioUrl(null);
  };

  const handleSaveQuestionLpartB = () => {
    const newQuestion = {
      sound: audioUrl,
      a: optionsLscq.a,
      b: optionsLscq.b,
      c: optionsLscq.c,
      d: optionsLscq.d,
      answer: selectedLscq,
    };

    setQuestionsLpartB((prev) => [...prev, newQuestion]);

    setShowModalLpartB(false);
    setOptionsLscq({ a: "", b: "", c: "", d: "" });
    setSelectedLscq("");
    setAudioUrl(null);
  };

  const handleSaveQuestionS = () => {
    const newQuestion = {
      n: optionsLscq.question,
      a: optionsLscq.a,
      b: optionsLscq.b,
      c: optionsLscq.c,
      d: optionsLscq.d,
      answer: selectedLscq,
    };

    setQuestionsS((prev) => [...prev, newQuestion]);

    setShowModalS(false);
    setOptionsLscq({ a: "", b: "", c: "", d: "", question: "" });
    setSelectedLscq("");
  };

  const handleSaveQuestionW = () => {
    if (!isValid) return;

    const newQuestion = {
      n: sentence,
      a: options.a,
      b: options.b,
      c: options.c,
      d: options.d,
      answer: correctAnswer,
    };

    setQuestionsW((prev) => [...prev, newQuestion]);

    resetEditor();
    setShowModalS(false);
  };

  const handleDeleteLpartA = (index) => {
    setQuestionsLpartA((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteLpartB = (index) => {
    setQuestionsLpartB((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteS = (index) => {
    setQuestionsS((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteW = (index) => {
    setQuestionsW((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const hasAudio = !!audioUrl;
    const allOptionsFilled =
      optionsLscq.a.trim() !== "" &&
      optionsLscq.b.trim() !== "" &&
      optionsLscq.c.trim() !== "" &&
      optionsLscq.d.trim() !== "";
    const hasAnswer = selectedLscq !== "";

    setIsValidQuestion(hasAudio && allOptionsFilled && hasAnswer);
  }, [audioUrl, optionsLscq, selectedLscq]);

  useEffect(() => {
    const allFilled = Object.values(optionsLscq).every(
      (val) => val.trim() !== ""
    );
    const hasSelected = selectedLscq !== "";
    setIsValidLscq(allFilled && hasSelected);
  }, [optionsLscq, selectedLscq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOptionsLscq((prev) => ({
      ...prev,
      [name.replace("lscq_option_", "")]: value,
    }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleAudioChangePartB = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFilePartB(file);
      setAudioUrlPartB(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setTipe("");
    if (kategori !== "1") {
      setAudioUrl(null);
    }
  }, [kategori]);

  const handleSaveCategory = () => {
    if (!newCategory.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Nama kategori wajib diisi!",
      });
      return;
    }

    fetch("https://online-course.bang-cenna.my.id/api/create_category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: newCategory,
        aktiv: "1",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from API:", data);
        if (data.status) {
          fetch("https://online-course.bang-cenna.my.id/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data));

          setNewCategory("");
          setShowModal(false);

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Kategori berhasil disimpan.",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menyimpan kategori",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menyimpan",
        });
      });
  };

  const handleEditClick = (cat) => {
    setEditCategory(cat);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Data kategori tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://online-course.bang-cenna.my.id/api/delete_category/${id}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              fetch("https://online-course.bang-cenna.my.id/api/categories")
                .then((res) => res.json())
                .then((data) => setCategories(data));

              Swal.fire("Terhapus!", "Kategori berhasil dihapus.", "success");
            } else {
              Swal.fire("Gagal!", "Kategori gagal dihapus.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Terjadi kesalahan server.", "error");
          });
      }
    });
  };

  const handleUpdateCategory = (cat) => {
    fetch(
      `https://online-course.bang-cenna.my.id/api/update_category/${cat.id_category}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: cat.category,
          aktiv: cat.aktiv,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          fetch("https://online-course.bang-cenna.my.id/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data));

          setShowEditModal(false);
          Swal.fire("Berhasil!", "Kategori berhasil diperbarui.", "success");
        } else {
          Swal.fire("Gagal!", "Kategori gagal diperbarui.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error!", "Terjadi kesalahan server.", "error");
      });
  };

  useEffect(() => {
    if (
      activeTabQuestion === "categories" ||
      activeTabQuestion === "newquestion"
    ) {
      setLoadingCat(true);
      fetch("https://online-course.bang-cenna.my.id/api/categories")
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched categories:", data);
          setCategories(data);
          setLoadingCat(false);
        })
        .catch((err) => {
          console.error("Failed to fetch categories:", err);
          setLoadingCat(false);
        });
    }
  }, [activeTabQuestion]);

  useEffect(() => {
    if (
      activeTabStudent === "allStudent" ||
      activeTabStudent === "userRegistered"
    ) {
      setLoadingCat(false);
    }
  }, [activeTabStudent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStudents = await fetch(
          "https://online-course.bang-cenna.my.id/api/get_students"
        );
        const dataStudents = await resStudents.json();

        const resUsers = await fetch(
          "https://online-course.bang-cenna.my.id/api/get_users"
        );
        const dataUsers = await resUsers.json();

        setAllStudents(dataStudents);
        setRegisteredUsers(dataUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='p-6'>
        <p>Loading students...</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+5.2%",
      color: "text-green-600",
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+2.1%",
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8.3%",
      color: "text-green-600",
    },
    { title: "Orders", value: "567", change: "-1.2%", color: "text-red-600" },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Created new account", time: "2 min ago" },
    { user: "Jane Smith", action: "Made a purchase", time: "5 min ago" },
    { user: "Mike Johnson", action: "Updated profile", time: "10 min ago" },
    { user: "Sarah Wilson", action: "Logged in", time: "15 min ago" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: faChartBar },
    { id: "students", label: "Students", icon: faUsers },
    { id: "questionbank", label: "Question Bank", icon: faQuestionCircle },
    { id: "exams", label: "Exams", icon: faFileAlt },
    { id: "grades", label: "Grades", icon: faStar },
    { id: "chats", label: "Chats", icon: faComments },
    { id: "reports", label: "Reports", icon: faBook },
    { id: "setting", label: "Setting", icon: faCog },
  ];

  const questiontabs = [
    { id: "allquestion", label: "All Question" },
    { id: "newquestion", label: "New Question" },
    { id: "categories", label: "Categories" },
  ];

  const studenttabs = [
    { id: "allStudent", label: "All Student" },
    { id: "userRegistered", label: "User Registered" },
  ];

  const tipeOptionsMap = {
    1: [
      { value: "lscq", label: "Single Choice" },
      { value: "lmcq", label: "Multiple Choice" },
      { value: "lord", label: "Ordering/Sequence" },
      { value: "lsum", label: "Sum" },
    ],
    2: [
      { value: "kscq", label: "Structure/Single Choice" },
      { value: "kerc", label: "Written Expression/Error Recognition" },
    ],
    3: [
      { value: "rscq", label: "Single Choice" },
      // { value: "rmcq", label: "Multiple Choice" },
      // { value: "rerc", label: "Error Recognition" },
      // { value: "rtrf", label: "True / False" },
      // { value: "rsum", label: "Summary" },
    ],
    4: [
      { value: "wtrf", label: "True / False" },
      { value: "wessay", label: "Essay" },
      { value: "wsum", label: "Summary" },
    ],
    5: [
      { value: "sessay", label: "Essay" },
      { value: "ssum", label: "Summary" },
    ],
  };

  const renderTipeInput = () => {
    switch (tipe) {
      case "kscq":
        return (
          <>
            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalS(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Question</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsS.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsS.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>
                        <td className='border px-3 py-2'>{q.n}</td>
                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteS(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              disabled={questionsS.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsS.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalS && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>

                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Question
                    </label>
                    <textarea
                      id='question'
                      rows={3}
                      name='lscq_option_question'
                      onChange={handleChange}
                      value={optionsLscq.question}
                      placeholder='Put the question here ...'
                      className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 resize-none'
                    ></textarea>
                  </div>

                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Opsi
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      Jawaban Benar
                    </div>
                  </div>
                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>A</span>
                      <input
                        type='text'
                        name='lscq_option_a'
                        value={optionsLscq.a}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi A'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='a'
                        checked={selectedLscq === "a"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>B</span>
                      <input
                        type='text'
                        name='lscq_option_b'
                        value={optionsLscq.b}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi B'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='b'
                        checked={selectedLscq === "b"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>C</span>
                      <input
                        type='text'
                        name='lscq_option_c'
                        value={optionsLscq.c}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi C'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='c'
                        checked={selectedLscq === "c"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>D</span>
                      <input
                        type='text'
                        name='lscq_option_d'
                        value={optionsLscq.d}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi D'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='d'
                        checked={selectedLscq === "d"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        setShowModalS(false);
                        setOptionsLscq({
                          a: "",
                          b: "",
                          c: "",
                          d: "",
                          question: "",
                        });
                        setSelectedLscq("");
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='addQueListScq'
                      disabled={!isValidLscq}
                      onClick={handleSaveQuestionS}
                      className={`px-4 py-2 rounded-lg shadow hover:cursor-pointer ${
                        isValidLscq
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "kerc":
        return (
          <>
            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalS(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Question</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsW.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsW.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>
                        <td
                          className='border px-3 py-2 text-left'
                          dangerouslySetInnerHTML={{ __html: q.n }} // ✅ render with underline
                        />
                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteW(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              disabled={questionsW.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsW.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalS && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>

                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Sentence
                    </div>
                  </div>
                  <div
                    id='editor'
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    spellCheck={false}
                    className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 min-h-[80px]'
                    placeholder='Masukkan kalimat lengkap...'
                  ></div>

                  <div id='opt' className='mt-2 mb-4 space-x-2'>
                    {["A", "B", "C", "D"].map((opt) => (
                      <button
                        key={opt}
                        type='button'
                        disabled={options[opt.toLowerCase()] !== ""}
                        className={`assignBtn px-3 py-1 rounded-md text-white 
                        ${
                          options[opt.toLowerCase()] !== ""
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-500 hover:bg-indigo-600"
                        }`}
                        onClick={() => handleOptionSelect(opt.toLowerCase())}
                      >
                        {opt}
                      </button>
                    ))}
                    <button
                      id='resetBtn'
                      type='button'
                      onClick={resetEditor}
                      className='mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600'
                    >
                      Reset Editor
                    </button>
                  </div>

                  {["a", "b", "c", "d"].map((key) => (
                    <div
                      key={key}
                      className='flex items-center justify-between mb-4'
                    >
                      <span className='w-6 font-medium text-gray-700'>
                        {key.toUpperCase()}
                      </span>
                      <input
                        type='text'
                        name={`part_${key}`}
                        id={`part_${key}`}
                        value={options[key]}
                        disabled
                        onChange={(e) =>
                          handleOptionChange(key, e.target.value)
                        }
                        className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2'
                        placeholder={`Opsi ${key.toUpperCase()}`}
                      />
                      <input
                        type='radio'
                        name='cAnswer'
                        value={key.toUpperCase()}
                        checked={correctAnswer === key.toUpperCase()}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  ))}

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        resetEditor();
                        setShowModalS(false);
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='validQuestion'
                      onClick={handleSaveQuestionW}
                      disabled={!isValid}
                      className={`px-4 py-2 rounded-lg shadow ${
                        isValid
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "rscq":
        return (
          <>
            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalS(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Question</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsS.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsS.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>
                        <td className='border px-3 py-2'>{q.n}</td>
                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteS(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              disabled={questionsS.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsS.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalS && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>

                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Question
                    </label>
                    <textarea
                      id='question'
                      rows={3}
                      name='lscq_option_question'
                      onChange={handleChange}
                      value={optionsLscq.question}
                      placeholder='Put the question here ...'
                      className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 resize-none'
                    ></textarea>
                  </div>

                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Opsi
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      Jawaban Benar
                    </div>
                  </div>
                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>A</span>
                      <input
                        type='text'
                        name='lscq_option_a'
                        value={optionsLscq.a}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi A'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='a'
                        checked={selectedLscq === "a"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>B</span>
                      <input
                        type='text'
                        name='lscq_option_b'
                        value={optionsLscq.b}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi B'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='b'
                        checked={selectedLscq === "b"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>C</span>
                      <input
                        type='text'
                        name='lscq_option_c'
                        value={optionsLscq.c}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi C'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='c'
                        checked={selectedLscq === "c"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>D</span>
                      <input
                        type='text'
                        name='lscq_option_d'
                        value={optionsLscq.d}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi D'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='d'
                        checked={selectedLscq === "d"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        setShowModalS(false);
                        setOptionsLscq({
                          a: "",
                          b: "",
                          c: "",
                          d: "",
                          question: "",
                        });
                        setSelectedLscq("");
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='addQueListScq'
                      disabled={!isValidLscq}
                      onClick={handleSaveQuestionS}
                      className={`px-4 py-2 rounded-lg shadow hover:cursor-pointer ${
                        isValidLscq
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderSoal = (part) => {
    switch (part) {
      case "prtA":
        return (
          <>
            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalLpartA(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Sound</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsLpartA.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsLpartA.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>

                        <td className='border px-3 py-2'>
                          {q.sound ? (
                            <audio controls className='mx-auto' src={q.sound} />
                          ) : (
                            <span className='text-gray-400'>No Audio</span>
                          )}
                        </td>

                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteLpartA(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSaveToDatabaseLPartA}
              disabled={questionsLpartA.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsLpartA.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalLpartA && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div
                  className='absolute inset-0 bg-black/40 backdrop-blur-sm'
                  onClick={() => setShowModalLpartA(false)}
                ></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Upload Audio (Listening)
                    </label>
                    <input
                      type='file'
                      id='audioUpload'
                      name='lscq_option_question'
                      accept='.mp3,.wav,.ogg'
                      onChange={handleAudioChange}
                      className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                    />
                    <p className='mt-1 text-xs text-gray-500'>
                      Format yang didukung: MP3, WAV, OGG
                    </p>

                    {audioUrl && (
                      <audio
                        id='audioPlayer'
                        controls
                        className='mt-2 w-full'
                        src={audioUrl}
                      />
                    )}
                  </div>
                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Opsi
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      Jawaban Benar
                    </div>
                  </div>
                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>A</span>
                      <input
                        type='text'
                        name='lscq_option_a'
                        value={optionsLscq.a}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi A'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='a'
                        checked={selectedLscq === "a"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>B</span>
                      <input
                        type='text'
                        name='lscq_option_b'
                        value={optionsLscq.b}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi B'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='b'
                        checked={selectedLscq === "b"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>C</span>
                      <input
                        type='text'
                        name='lscq_option_c'
                        value={optionsLscq.c}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi C'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='c'
                        checked={selectedLscq === "c"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>D</span>
                      <input
                        type='text'
                        name='lscq_option_d'
                        value={optionsLscq.d}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi D'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='d'
                        checked={selectedLscq === "d"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        setShowModalLpartA(false);
                        setOptionsLscq({
                          a: "",
                          b: "",
                          c: "",
                          d: "",
                          question: "",
                        });
                        setSelectedLscq("");
                        setAudioUrl(null);
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='addQueListScq'
                      disabled={!isValidQuestion}
                      onClick={handleSaveQuestionLpartA}
                      className={`px-4 py-2 rounded-lg shadow hover:cursor-pointer ${
                        isValidQuestion
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "prtB":
        return (
          <>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Passage Audio (Listening)
              </label>
              <input
                type='file'
                id='audioUpload'
                accept='.mp3,.wav,.ogg'
                onChange={handleAudioChangePartB}
                className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Format yang didukung: MP3, WAV, OGG
              </p>

              {audioUrlPartB && (
                <audio
                  id='audioPlayer'
                  controls
                  className='mt-2 w-full'
                  src={audioUrlPartB}
                />
              )}
            </div>

            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalLpartB(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Sound</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsLpartB.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsLpartB.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>

                        <td className='border px-3 py-2'>
                          {q.sound ? (
                            <audio controls className='mx-auto' src={q.sound} />
                          ) : (
                            <span className='text-gray-400'>No Audio</span>
                          )}
                        </td>

                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteLpartB(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSaveToDatabaseLPartB}
              disabled={questionsLpartB.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsLpartB.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalLpartB && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div
                  className='absolute inset-0 bg-black/40 backdrop-blur-sm'
                  onClick={() => setShowModalLpartB(false)}
                ></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Upload Audio (Listening)
                    </label>
                    <input
                      type='file'
                      id='audioUpload'
                      accept='.mp3,.wav,.ogg'
                      name='lscq_option_question'
                      onChange={handleAudioChange}
                      className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                    />
                    <p className='mt-1 text-xs text-gray-500'>
                      Format yang didukung: MP3, WAV, OGG
                    </p>

                    {audioUrl && (
                      <audio
                        id='audioPlayer'
                        controls
                        className='mt-2 w-full'
                        src={audioUrl}
                      />
                    )}
                  </div>
                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Opsi
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      Jawaban Benar
                    </div>
                  </div>
                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>A</span>
                      <input
                        type='text'
                        name='lscq_option_a'
                        value={optionsLscq.a}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi A'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='a'
                        checked={selectedLscq === "a"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>B</span>
                      <input
                        type='text'
                        name='lscq_option_b'
                        value={optionsLscq.b}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi B'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='b'
                        checked={selectedLscq === "b"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>C</span>
                      <input
                        type='text'
                        name='lscq_option_c'
                        value={optionsLscq.c}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi C'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='c'
                        checked={selectedLscq === "c"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>D</span>
                      <input
                        type='text'
                        name='lscq_option_d'
                        value={optionsLscq.d}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi D'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='d'
                        checked={selectedLscq === "d"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        setShowModalLpartB(false);
                        setOptionsLscq({ a: "", b: "", c: "", d: "" });
                        setSelectedLscq("");
                        setAudioUrl(null);
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='addQueListScq'
                      disabled={!isValidQuestion}
                      onClick={handleSaveQuestionLpartB}
                      className={`px-4 py-2 rounded-lg shadow hover:cursor-pointer ${
                        isValidQuestion
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "prtC":
        return (
          <>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Passage Audio (Listening)
              </label>
              <input
                type='file'
                id='audioUpload'
                accept='.mp3,.wav,.ogg'
                onChange={handleAudioChangePartB}
                className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Format yang didukung: MP3, WAV, OGG
              </p>

              {audioUrlPartB && (
                <audio
                  id='audioPlayer'
                  controls
                  className='mt-2 w-full'
                  src={audioUrlPartB}
                />
              )}
            </div>

            <div className='flex space-x-3 mb-6'>
              <button
                onClick={() => setShowModalLpartB(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700'
              >
                Add New Question
              </button>
              <button className='px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700'>
                Download Template
              </button>
              <button className='px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600'>
                Upload Template
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-gray-200 text-sm text-gray-700'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='border px-3 py-2'>#</th>
                    <th className='border px-3 py-2'>Sound</th>
                    <th className='border px-3 py-2'>Option A</th>
                    <th className='border px-3 py-2'>Option B</th>
                    <th className='border px-3 py-2'>Option C</th>
                    <th className='border px-3 py-2'>Option D</th>
                    <th className='border px-3 py-2'>Answer</th>
                    <th className='border px-3 py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionsLpartB.length === 0 ? (
                    <tr>
                      <td
                        colSpan='8'
                        className='border px-3 py-2 text-center text-gray-500'
                      >
                        No Question Yet
                      </td>
                    </tr>
                  ) : (
                    questionsLpartB.map((q, idx) => (
                      <tr key={idx} className='text-center'>
                        <td className='border px-3 py-2'>{idx + 1}</td>

                        <td className='border px-3 py-2'>
                          {q.sound ? (
                            <audio controls className='mx-auto' src={q.sound} />
                          ) : (
                            <span className='text-gray-400'>No Audio</span>
                          )}
                        </td>

                        <td className='border px-3 py-2'>{q.a}</td>
                        <td className='border px-3 py-2'>{q.b}</td>
                        <td className='border px-3 py-2'>{q.c}</td>
                        <td className='border px-3 py-2'>{q.d}</td>
                        <td className='border px-3 py-2 uppercase'>
                          {q.answer}
                        </td>
                        <td className='border px-3 py-2'>
                          <button
                            onClick={() => handleDeleteLpartB(idx)}
                            className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSaveToDatabaseLPartC}
              disabled={questionsLpartB.length === 0}
              className={`px-4 py-2 rounded-lg shadow mt-4 ${
                questionsLpartB.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save To Database
            </button>

            {showModalLpartB && (
              <div className='fixed inset-0 z-50 flex items-center justify-center text-gray-800'>
                <div
                  className='absolute inset-0 bg-black/40 backdrop-blur-sm'
                  onClick={() => setShowModalLpartB(false)}
                ></div>

                <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 z-10'>
                  <h2 className='text-lg font-semibold mb-4'>
                    Add New Question
                  </h2>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Upload Audio (Listening)
                    </label>
                    <input
                      type='file'
                      id='audioUpload'
                      accept='.mp3,.wav,.ogg'
                      name='lscq_option_question'
                      onChange={handleAudioChange}
                      className='mt-1 w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                    />
                    <p className='mt-1 text-xs text-gray-500'>
                      Format yang didukung: MP3, WAV, OGG
                    </p>

                    {audioUrl && (
                      <audio
                        id='audioPlayer'
                        controls
                        className='mt-2 w-full'
                        src={audioUrl}
                      />
                    )}
                  </div>
                  <div className='flex justify-between mb-2'>
                    <div className='text-sm font-medium text-gray-700'>
                      Opsi
                    </div>
                    <div className='text-sm font-medium text-gray-700'>
                      Jawaban Benar
                    </div>
                  </div>
                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>A</span>
                      <input
                        type='text'
                        name='lscq_option_a'
                        value={optionsLscq.a}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi A'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='a'
                        checked={selectedLscq === "a"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>B</span>
                      <input
                        type='text'
                        name='lscq_option_b'
                        value={optionsLscq.b}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi B'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='b'
                        checked={selectedLscq === "b"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>C</span>
                      <input
                        type='text'
                        name='lscq_option_c'
                        value={optionsLscq.c}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi C'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='c'
                        checked={selectedLscq === "c"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-2 text-gray-500'>
                    <div className='flex items-center flex-1 space-x-2'>
                      <span className='w-6 font-medium text-gray-700'>D</span>
                      <input
                        type='text'
                        name='lscq_option_d'
                        value={optionsLscq.d}
                        onChange={handleChange}
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Masukkan opsi D'
                      />
                      <input
                        type='radio'
                        name='lscq_opt'
                        value='d'
                        checked={selectedLscq === "d"}
                        onChange={(e) => setSelectedLscq(e.target.value)}
                        className='ml-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end space-x-3 mt-6'>
                    <button
                      onClick={() => {
                        setShowModalLpartB(false);
                        setOptionsLscq({ a: "", b: "", c: "", d: "" });
                        setSelectedLscq("");
                        setAudioUrl(null);
                      }}
                      className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      id='addQueListScq'
                      disabled={!isValidQuestion}
                      onClick={handleSaveQuestionLpartB}
                      className={`px-4 py-2 rounded-lg shadow hover:cursor-pointer ${
                        isValidQuestion
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const handleSaveToDatabaseLPartA = async () => {
    try {
      const formData = new FormData();

      for (let i = 0; i < questionsLpartA.length; i++) {
        const q = questionsLpartA[i];

        const blob = await fetch(q.sound).then((res) => res.blob());

        formData.append("section", "listening");
        formData.append("part", "A");

        formData.append(`sound_${i}`, blob, `sound_${i}.wav`);

        formData.append(`a_${i}`, q.a);
        formData.append(`b_${i}`, q.b);
        formData.append(`c_${i}`, q.c || "");
        formData.append(`d_${i}`, q.d || "");
        formData.append(`answer_${i}`, q.answer || "");
      }

      formData.append("count", questionsLpartA.length);

      const response = await fetch(
        "https://online-course.bang-cenna.my.id/api/save",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.status === true) {
        setQuestionsLpartA([]);

        Swal.fire({
          icon: "success",
          title: "Data Saved!",
          text: result.message,
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  const handleSaveToDatabaseLPartB = async () => {
    try {
      const formData = new FormData();

      formData.append("section", "listening");
      formData.append("part", "B");

      // Passage audio (outside file input)
      if (audioFilePartB) {
        formData.append("sound", audioFilePartB, audioFilePartB.name);
      }

      // Append questions
      for (let i = 0; i < questionsLpartB.length; i++) {
        const q = questionsLpartB[i];

        // Convert question sound to blob if available
        if (q.sound) {
          const questionBlob = await fetch(q.sound).then((res) => res.blob());
          formData.append(`sound_${i}`, questionBlob, `sound_${i}.wav`);
        }

        formData.append(`a_${i}`, q.a);
        formData.append(`b_${i}`, q.b);
        formData.append(`c_${i}`, q.c || "");
        formData.append(`d_${i}`, q.d || "");
        formData.append(`answer_${i}`, q.answer || "");
      }

      formData.append("count", questionsLpartB.length);

      const response = await fetch(
        "https://online-course.bang-cenna.my.id/api/savePartB",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("✅ Server response:", result);

      if (result.status === true) {
        // reset states
        setQuestionsLpartB([]);
        setAudioFilePartB(null);
        setAudioUrlPartB(null);

        Swal.fire({
          icon: "success",
          title: "Data Saved!",
          text: result.message,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  const handleSaveToDatabaseLPartC = async () => {
    try {
      const formData = new FormData();

      formData.append("section", "listening");
      formData.append("part", "C");

      if (audioFilePartB) {
        formData.append("sound", audioFilePartB, audioFilePartB.name);
      }

      for (let i = 0; i < questionsLpartB.length; i++) {
        const q = questionsLpartB[i];

        if (q.sound) {
          const questionBlob = await fetch(q.sound).then((res) => res.blob());
          formData.append(`sound_${i}`, questionBlob, `sound_${i}.wav`);
        }

        formData.append(`a_${i}`, q.a);
        formData.append(`b_${i}`, q.b);
        formData.append(`c_${i}`, q.c || "");
        formData.append(`d_${i}`, q.d || "");
        formData.append(`answer_${i}`, q.answer || "");
      }

      formData.append("count", questionsLpartB.length);

      const response = await fetch(
        "https://online-course.bang-cenna.my.id/api/savePartB",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("✅ Server response:", result);

      if (result.status === true) {
        // reset states
        setQuestionsLpartB([]);
        setAudioFilePartB(null);
        setAudioUrlPartB(null);

        Swal.fire({
          icon: "success",
          title: "Data Saved!",
          text: result.message,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    }
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <img
                src={session.user?.image || "/api/placeholder/40/40"}
                alt='PP'
                className='w-10 h-10 rounded-full border-2 border-gray-300'
              />
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-900'>
                  {session.user?.name}
                </p>
                <p className='text-xs text-gray-500'>{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200'
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className='flex'>
        <aside className='hidden lg:block w-64 bg-white shadow-sm min-h-screen'>
          <nav className='mt-6'>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                  activeTab === item.id
                    ? "border-r-4 border-blue-500 bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className='mr-3 w-5 h-5' />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around py-2'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group flex flex-col items-center text-sm ${
                activeTab === item.id ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className='text-xl' />

              <span className='absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition'>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <main className='flex-1 p-6'>
          {activeTab === "dashboard" && (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          {stat.title}
                        </p>
                        <p className='text-3xl font-bold text-gray-900 mt-1'>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${stat.color}`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Recent Activity
                  </h3>
                  <div className='space-y-3'>
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between py-2'
                      >
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {activity.user}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {activity.action}
                          </p>
                        </div>
                        <span className='text-xs text-gray-400'>
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Quick Actions
                  </h3>
                  <div className='space-y-3'>
                    <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
                      <div className='font-medium text-gray-900'>
                        Add New User
                      </div>
                      <div className='text-sm text-gray-500'>
                        Create a new user account
                      </div>
                    </button>
                    <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
                      <div className='font-medium text-gray-900'>
                        Generate Report
                      </div>
                      <div className='text-sm text-gray-500'>
                        Create monthly analytics report
                      </div>
                    </button>
                    <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200'>
                      <div className='font-medium text-gray-900'>
                        System Backup
                      </div>
                      <div className='text-sm text-gray-500'>
                        Backup system data
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "students" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <div className='border-b border-gray-200 mb-4'>
                <nav className='flex space-x-6'>
                  {studenttabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabStudent(tab.id)}
                      className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
                        activeTabStudent === tab.id
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className='mt-4'>
                {activeTabStudent === "allStudent" && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full border border-gray-200 text-sm'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='px-4 py-2 border text-gray-800'>ID</th>
                          <th className='px-4 py-2 border text-gray-800'>
                            Name
                          </th>
                          <th className='px-4 py-2 border text-gray-800'>
                            Email
                          </th>
                          <th className='px-4 py-2 border text-gray-800'>
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allStudents.length > 0 ? (
                          allStudents.map((student, index) => (
                            <tr
                              key={student.id_user}
                              className='hover:bg-gray-50'
                            >
                              <td className='px-4 py-2 border text-gray-800'>
                                {index + 1}
                              </td>
                              <td className='px-4 py-2 border text-gray-800'>
                                {student.name}
                              </td>
                              <td className='px-4 py-2 border text-gray-800'>
                                {student.email}
                              </td>
                              <td className='px-4 py-2 border text-gray-800'>
                                {student.role}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan='4'
                              className='text-center py-4 text-gray-500'
                            >
                              No Students Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTabStudent === "userRegistered" && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full border border-gray-200 text-sm'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='px-4 py-2 border text-gray-800'>ID</th>
                          <th className='px-4 py-2 border text-gray-800'>
                            Name
                          </th>
                          <th className='px-4 py-2 border text-gray-800'>
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.length > 0 ? (
                          registeredUsers.map((user, index) => (
                            <tr key={user.id_user} className='hover:bg-gray-50'>
                              <td className='px-4 py-2 border text-gray-800'>
                                {index + 1}
                              </td>
                              <td className='px-4 py-2 border text-gray-800'>
                                {user.name}
                              </td>
                              <td className='px-4 py-2 border text-gray-800'>
                                {user.email}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan='3'
                              className='text-center py-4 text-gray-500'
                            >
                              No Users Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab == "questionbank" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <div className='border-b border-gray-200 mb-4'>
                <nav className='flex space-x-6'>
                  {questiontabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabQuestion(tab.id)}
                      className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
                        activeTabQuestion === tab.id
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className='mt-4'>
                {activeTabQuestion === "allquestion" && (
                  <div>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
                      <div className='flex items-center gap-2'>
                        <label
                          htmlFor='rowsPerPage'
                          className='text-gray-700 text-sm'
                        >
                          Show
                        </label>
                        <select
                          id='rowsPerPage'
                          className='border border-gray-300 rounded px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500 text-black'
                        >
                          <option value='10'>10</option>
                          <option value='15'>15</option>
                          <option value='20'>20</option>
                          <option value='30'>30</option>
                          <option value='50'>50</option>
                        </select>
                        <span className='text-gray-700 text-sm'>entries</span>
                      </div>
                      <div className='flex items-center'>
                        <label htmlFor='searchInput' className='sr-only'>
                          Search
                        </label>
                        <input
                          id='searchInput'
                          type='text'
                          placeholder='Search...'
                          className='border border-gray-300 rounded px-3 py-1 text-sm focus:ring-indigo-500 focus:text-black focus:border-indigo-500 w-full md:w-64 text-gray-500'
                        />
                      </div>
                    </div>

                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm text-left border border-gray-200'>
                        <thead className='bg-gray-100 border-b border-gray-200 text-gray-700'>
                          <tr>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Product Name</th>
                            <th className='px-4 py-2'>Category</th>
                            <th className='px-4 py-2'>Price</th>
                            <th className='px-4 py-2'>Stock</th>
                            <th className='px-4 py-2'>Actions</th>
                          </tr>
                        </thead>
                        <tbody id='productsTable' className='text-gray-700'>
                          <tr>
                            <td className='px-4 py-2'>1</td>
                            <td className='px-4 py-2'>Sample Product</td>
                            <td className='px-4 py-2'>Category A</td>
                            <td className='px-4 py-2'>$100</td>
                            <td className='px-4 py-2'>25</td>
                            <td className='px-4 py-2'>
                              <button className='px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'>
                                Edit
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4'>
                      <div id='tableInfo' className='text-sm text-gray-600'>
                        Showing 0 to 0 of 0 entries
                      </div>
                      <div className='flex items-center gap-1'>
                        <button className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 text-gray-700'>
                          First
                        </button>
                        <button className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 text-gray-700'>
                          Prev
                        </button>
                        <span className='px-3 py-1 border border-gray-300 rounded text-sm bg-indigo-500 text-white'>
                          1
                        </span>
                        <button className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 text-gray-700'>
                          Next
                        </button>
                        <button className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 text-gray-700'>
                          Last
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabQuestion === "newquestion" && (
                  <div>
                    <div className='mb-4'>
                      <select
                        id='soalKat'
                        value={kategori}
                        onChange={handleKategoriChange}
                        className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                      >
                        <option value=''>-- Pilih Kategori --</option>
                        {categories.map((cat) => (
                          <option key={cat.id_category} value={cat.id_category}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {kategori && (
                      <>
                        {kategori === "1" && (
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Part
                            </label>
                            <select
                              id='listeningType'
                              value={lPart}
                              onChange={handleLpartChange}
                              className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                            >
                              <option value=''>-- Pilih Part --</option>
                              <option value='prtA'>Part A</option>
                              <option value='prtB'>Part B</option>
                              <option value='prtC'>Part C</option>
                            </select>
                          </div>
                        )}

                        {kategori !== "1" && (
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Tipe
                            </label>
                            <select
                              id='soalTipe'
                              value={tipe}
                              onChange={handleTipeChange}
                              className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'
                            >
                              <option value=''>-- Pilih Tipe --</option>
                              {tipeOptionsMap[kategori]?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {renderTipeInput()}
                        {kategori === "1" && renderSoal(lPart)}
                      </>
                    )}
                  </div>
                )}

                {activeTabQuestion === "categories" && (
                  <div className='bg-white rounded-lg shadow p-4'>
                    <div className='flex justify-start mb-4'>
                      <button
                        id='addCategory'
                        onClick={() => setShowModal(true)}
                        className='px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:cursor-pointer'
                      >
                        + Kategori
                      </button>
                    </div>
                    <hr className='mb-3' />

                    {loadingCat ? (
                      <p className='text-gray-500'>Loading...</p>
                    ) : (
                      <table className='w-full text-sm text-left border border-gray-200 text-gray-700'>
                        <thead className='bg-gray-100 border-b border-gray-200'>
                          <tr>
                            <th className='px-4 py-2'>#</th>
                            <th className='px-4 py-2'>Kategori</th>
                            <th className='px-4 py-2'>Aktif?</th>
                            <th className='px-4 py-2'>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.length > 0 ? (
                            categories.map((cat, index) => (
                              <tr key={cat.id_category}>
                                <td className='px-4 py-2'>{index + 1}</td>
                                <td className='px-4 py-2'>{cat.category}</td>
                                <td className='px-4 py-2'>
                                  {cat.aktiv === "1" ? (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className='text-green-500'
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className='text-red-500'
                                    />
                                  )}
                                </td>
                                <td className='px-4 py-2'>
                                  <button
                                    onClick={() => handleEditClick(cat)}
                                    className='inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-300 rounded-lg hover:bg-blue-400 mr-2 hover:cursor-pointer hover:text-white'
                                  >
                                    <FontAwesomeIcon
                                      icon={faPenToSquare}
                                      className='mr-1'
                                    />
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteClick(cat.id_category)
                                    }
                                    className='inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-300 rounded-lg hover:bg-red-400 hover:cursor-pointer hover:text-white'
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      className='mr-1'
                                    />
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan='4'
                                className='px-4 py-2 text-center text-2xl text-red-400'
                              >
                                Tidak ada data
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab == "exams" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <p className='text-gray-600'>
                This section is under development...
              </p>
            </div>
          )}

          {activeTab == "grades" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <p className='text-gray-600'>
                This section is under development...
              </p>
            </div>
          )}

          {activeTab == "chats" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <p className='text-gray-600'>
                This section is under development...
              </p>
            </div>
          )}

          {activeTab == "reports" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <p className='text-gray-600'>
                This section is under development...
              </p>
            </div>
          )}

          {activeTab == "setting" && (
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h3>
              <p className='text-gray-600'>
                This section is under development...
              </p>
            </div>
          )}

          {/* {activeTab !== "dashboard" &&
            activeTab !== "students" &&
            activeTab !== "questionbank" && (
              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  {menuItems.find((item) => item.id === activeTab)?.label}
                </h3>
                <p className='text-gray-600'>
                  This section is under development.
                </p>
              </div>
            )} */}

          {showModal && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 text-gray-800'>
              <div className='bg-white rounded-lg shadow-lg w-96 p-6 relative'>
                <h2 className='text-lg font-semibold mb-4 flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add New Category</span>
                </h2>

                <input
                  type='text'
                  placeholder='Nama kategori'
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className='w-full border rounded-lg px-3 py-2 mb-4 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                />

                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => setShowModal(false)}
                    className='px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400'
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditModal && editCategory && (
            <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 text-gray-800'>
              <div className='bg-white rounded-lg shadow-lg w-96 p-6 relative'>
                <h2 className='text-lg font-semibold mb-4 flex items-center space-x-2'>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>Edit Category</span>
                </h2>

                <input
                  type='text'
                  value={editCategory.category}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      category: e.target.value,
                    })
                  }
                  className='w-full border rounded-lg px-3 py-2 mb-4 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                />

                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className='px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400'
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleUpdateCategory(editCategory)}
                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
