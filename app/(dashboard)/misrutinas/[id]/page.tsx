import TablaRutinaEjercicios from "@/components/misrutinas/TablaRutinaEjercicios";


interface Props {
  params: { id: string };
}

export default function RutinaDetallePage({ params }: Props) {
  const rutinaId = parseInt(params.id);

  return <TablaRutinaEjercicios rutina_id={rutinaId} />;
}
