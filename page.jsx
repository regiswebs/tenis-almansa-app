import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔌 CONFIGURACIÓN SUPABASE
const supabase = createClient(
"https://ibymnbjfrlzthvutrsdm.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieW1uYmpmcmx6dGh2dXRyc2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MTYsImV4cCI6MjA5MDI2ODYxNn0._uTfrpLQPB-e4Lno7Q2fpukdMcawOx0LhVPEk3opqFo"
);

export default function App() {
const [email, setEmail] = useState("");
const [students, setStudents] = useState([]);
const [classes, setClasses] = useState([]);

useEffect(() => {
loadData();
}, []);

const loadData = async () => {
const { data: studentsData } = await supabase.from("students").select("*");
const { data: classesData } = await supabase.from("classes").select("*");
setStudents(studentsData || []);
setClasses(classesData || []);
};

const login = async () => {
const { error } = await supabase.auth.signInWithOtp({ email });
if (!error) alert("Revisa tu email para acceder");
};

const bookClass = async (classId) => {
const student = students.find(s => s.email === email);
if (!student) return alert("No estás registrado");

```
await supabase.from("bookings").insert({
  student_id: student.id,
  class_id: classId
});

alert("Reserva realizada");
```

};

const generatePayments = async () => {
const month = new Date().toLocaleString("default", { month: "long" });

```
for (let s of students) {
  await supabase.from("payments").insert({
    student_id: s.id,
    month,
    paid: false
  });
}

alert("Cuotas generadas");
```

};

return (
<div style={{ padding: 20 }}> <h1>🎾 Escuela de Tenis Almansa</h1>

```
  <input
    placeholder="Tu email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <button onClick={login}>Login</button>

  <h2>Clases disponibles</h2>
  {classes.map(c => (
    <div key={c.id}>
      {c.name}
      <button onClick={() => bookClass(c.id)}>Reservar</button>
    </div>
  ))}

  <h2>Admin</h2>
  <button onClick={generatePayments}>
    Generar cuotas mensuales
  </button>
</div>
```

);
}
