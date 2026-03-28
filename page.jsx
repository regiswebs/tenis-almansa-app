import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🔌 CONFIGURACIÓN REAL SUPABASE
const supabase = createClient(
  "https://ibymnbjfrlzthvutrsdm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieW1uYmpmcmx6dGh2dXRyc2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MTYsImV4cCI6MjA5MDI2ODYxNn0._uTfrpLQPB-e4Lno7Q2fpukdMcawOx0LhVPEk3opqFo"
);

export default function TennisSchoolLiveApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // LOGIN REAL
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (!error) alert("Revisa tu email para acceder");
  };

  // CARGAR DATOS
  const loadData = async () => {
    const { data: studentsData } = await supabase.from("students").select("*");
    const { data: classesData } = await supabase.from("classes").select("*");
    setStudents(studentsData || []);
    setClasses(classesData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // RESERVAR
  const bookClass = async (classId) => {
    const student = students.find(s => s.email === email);
    if (!student) return alert("No estás registrado");

    await supabase.from("bookings").insert({
      student_id: student.id,
      class_id: classId
    });

    alert("Reserva hecha");
  };

  // GENERAR PAGOS
  const generatePayments = async () => {
    const month = new Date().toLocaleString("default", { month: "long" });

    for (let s of students) {
      await supabase.from("payments").insert({
        student_id: s.id,
        month,
        paid: false
      });
    }

    alert("Pagos generados");
  };

  return (
    <div className="p-4 max-w-md mx-auto grid gap-4">
      <Card className="p-4">
        <h1 className="text-xl font-bold">🎾 Escuela Tenis Almansa</h1>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={login}>Login</Button>
      </Card>

      <Card className="p-4">
        <h2 className="font-bold">Clases disponibles</h2>
        {classes.map(c => (
          <div key={c.id} className="flex justify-between">
            <span>{c.name}</span>
            <Button onClick={() => bookClass(c.id)}>Reservar</Button>
          </div>
        ))}
      </Card>

      <Card className="p-4">
        <Button onClick={generatePayments}>
          Generar cuotas mensuales
        </Button>
      </Card>
    </div>
  );
}
