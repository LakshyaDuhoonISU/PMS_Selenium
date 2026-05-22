import { useEffect, useState } from 'react'
import styles from './Stats.module.css'
import { Link } from 'react-router-dom'

function Stats() {
    let [stats, setStats] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3000/products/stats')
            .then((res) => res.json())
            .then((data) => {
                setStats(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message || 'Failed to load')
                setLoading(false)
            })
    }, [])

    if (loading) return <div className={styles.container}><p>Loading...</p></div>
    if (error) return <div className={styles.container}><p>Error: {error}</p></div>

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Product Stats</h1>
                <Link to="/products"><button className={styles.backBtn}>Back</button></Link>
            </div>

            <div className={styles.card}>
                <p><strong>Total products:</strong> {stats.totalProducts}</p>
                <p><strong>Total inventory value:</strong> {stats.totalInventoryValue}</p>
            </div>

            <div className={styles.card}>
                <h3>By Category</h3>
                <ul className={styles.list}>
                    {stats.byCategory && Object.keys(stats.byCategory).length > 0 ? (
                        Object.entries(stats.byCategory).map(([cat, count]) => (
                            <li key={cat} className={styles.listItem}>{cat}: {count}</li>
                        ))
                    ) : (
                        <li className={styles.listItem}>No categories</li>
                    )}
                </ul>
            </div>
        </section>
    )
}

export default Stats
