import TablaRutinaEjerciciosEditable from "@/components/rutinas/TablaRutinaEjerciciosEditable";

interface Props {
  params: { id: string };
}

export default function RutinaDetallePage({ params }: Props) {
  const rutinaId = parseInt(params.id);

  return <TablaRutinaEjerciciosEditable rutina_id={rutinaId} />;
}
