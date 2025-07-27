export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // 👈 necesario para fotos de Google
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'manuqui-gym.pedrolmendoza031297.workers.dev',
        pathname: '**', // permite todas las rutas
      },
    ]
  }
};
