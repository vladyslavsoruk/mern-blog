// import CallToAction from "../components/CallToAction";

// export default function Projects() {
//   return (
//     <div className="min-h-[calc(100vh-72px)] max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6">
//       <h1 className="text-4xl font-bold text-center">Explore Our Projects</h1>
//       <p className="text-lg text-gray-600 dark:text-gray-400 text-justify max-w-3xl">
//         Dive into a collection of fun and engaging projects designed to help you
//         learn and master HTML, CSS and JavaScript. Whether you're a beginner or
//         an experienced developer, these projects will challenge your skills and
//         inspire creativity. Start building today and take your development
//         journey to the next level!
//       </p>
//       <div className="w-full flex flex-col gap-6">
//         <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold">Why Build Projects?</h2>
//           <p className="text-gray-700 dark:text-gray-400 mt-2 text-justify">
//             Building projects is one of the best ways to learn programming. It
//             allows you to apply theoretical knowledge in a practical way, solve
//             real-world problems and create a portfolio that showcases your
//             skills to potential employers or clients.
//           </p>
//         </section>
//         <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold">What You'll Learn</h2>
//           <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 mt-2">
//             <li>How to structure HTML for clean and semantic code</li>
//             <li>Styling with CSS to create visually appealing designs</li>
//             <li>Adding interactivity with JavaScript</li>
//             <li>Debugging and problem-solving techniques</li>
//             <li>Best practices for responsive and accessible web design</li>
//           </ul>
//         </section>
//       </div>
//       <CallToAction />
//     </div>
//   );
// }

import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-[calc(100vh-72px)] max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6">
      <h1 className="text-4xl font-bold text-center">Explore Our Projects</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-justify">
        Dive into a curated set of hands‑on NestJS tutorials designed to take
        you from zero to production‑ready back‑end developer. Whether you're
        just getting started with TypeScript or looking to build scalable,
        maintainable server‑side applications, these projects will challenge and
        inspire you. Start coding today and master NestJS!
      </p>
      <div className="w-full flex flex-col gap-6">
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Why Learn NestJS?</h2>
          <p className="text-gray-700 dark:text-gray-400 mt-2 text-justify">
            NestJS combines the power of TypeScript, the flexibility of Express
            (or Fastify), and a modular architecture inspired by Angular.
            Building real‑world APIs, microservices, and GraphQL servers has
            never been more structured or enjoyable.
          </p>
        </section>
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">What You'll Master</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 mt-2">
            <li>
              Creating controllers, providers, and modules for clean
              architecture
            </li>
            <li>
              Using decorators, pipes, guards, and interceptors to enforce
              business logic
            </li>
            <li>Connecting to databases with TypeORM, Mongoose, or Prisma</li>
            <li>
              Building RESTful APIs, GraphQL endpoints, and event‑based
              microservices
            </li>
            <li>
              Writing unit and integration tests with Jest for robust
              applications
            </li>
            <li>and much more...</li>
          </ul>
        </section>
      </div>
      <CallToAction />
    </div>
  );
}
