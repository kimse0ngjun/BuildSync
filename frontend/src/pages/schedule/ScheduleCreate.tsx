// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createSchedule } from "../../api/schedule";
// import "../../styles/SchedulePage.css";


// function ScheduleCreate() {

//   const navigate = useNavigate();

//   const companyId = 1;

//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     startDate: "",
//     endDate: "",
//     siteId: 1,
//   });


//   const change = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {

//     const { name, value } = e.target;

//     setForm({
//       ...form,
//       [name]: value,
//     });

//   };


//   const submit = async () => {

//     try {

//       await createSchedule(
//         companyId,
//         {
//           ...form,
//           siteId: Number(form.siteId),
//         }
//       );

//       alert("일정 등록 완료");

//       navigate("/schedule");

//     } catch(e) {

//       console.error(e);
//       alert("등록 실패");

//     }

//   };


//   return (
//     <div className="schedule-page">

//       <h1>
//         공사 일정 등록
//       </h1>


//       <div className="schedule-form">


//         <input
//           name="title"
//           placeholder="일정 제목"
//           value={form.title}
//           onChange={change}
//         />


//         <textarea
//           name="content"
//           placeholder="내용"
//           value={form.content}
//           onChange={change}
//         />


//         <label>
//           시작일
//         </label>

//         <input
//           type="date"
//           name="startDate"
//           value={form.startDate}
//           onChange={change}
//         />


//         <label>
//           종료일
//         </label>

//         <input
//           type="date"
//           name="endDate"
//           value={form.endDate}
//           onChange={change}
//         />


//         <input
//           type="number"
//           name="siteId"
//           placeholder="현장 ID"
//           value={form.siteId}
//           onChange={change}
//         />


//         <button
//           onClick={submit}
//         >
//           등록
//         </button>

//       </div>
//     </div>
//   );
// }


// export default ScheduleCreate;