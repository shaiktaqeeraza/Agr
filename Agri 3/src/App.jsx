function App() {
  return (
    <main className="min-h-screen px-6 py-12 text-slate-800">
      <section className="mx-auto max-w-5xl">
        <header className="mb-12 flex items-center justify-between">
          <a className="brand-text text-2xl" href="/">
            CropsConnection
          </a>
          <button className="btn-primary" type="button">
            Get started
          </button>
        </header>

        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-green-700">
              Built for growers and buyers
            </p>
            <h1 className="mb-6 text-4xl leading-tight md:text-6xl">
              Connect your harvest with the right people.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
              Share crops, discover local produce, and negotiate directly with
              trusted members of the farming community.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" type="button">
                Explore crops
              </button>
              <button className="btn-secondary" type="button">
                Learn more
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Featured listing</p>
                <h2 className="text-2xl">Fresh wheat harvest</h2>
              </div>
              <span className="badge-green">Available</span>
            </div>
            <div className="mb-6 rounded-2xl bg-green-100 p-8 text-center text-6xl">
              🌾
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">From Green Valley Farm</p>
                <p className="mt-1 font-semibold">Available now</p>
              </div>
              <p className="text-xl font-bold text-green-700">$420 / ton</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
