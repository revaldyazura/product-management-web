import React, {useEffect} from 'react';
import '../../styles/components/common/DetailView.css';

/**
 * DetailView — kerangka tampilan detail yang reusable
 *
 * Props:
 * - media?: string | ReactNode  // url gambar atau elemen kustom di sisi kiri
 * - fields: Array<{ label: string, value?: React.ReactNode }>
 * - status?: React.ReactNode     // biasanya <StatusBadge />
 * - aside?: React.ReactNode      // panel samping kanan (opsional)
 */
export default function DetailView({ media, fields = [], status, aside }) {
    const renderMedia = () => {
        if (!media) return null;
        if (typeof media === 'string') {
            return (
                <div className="detailview__media">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={media} alt="Detail image" />
                </div>
            );
        }
        return <div className="detailview__media">{media}</div>;
    };

    return (
        <div className="detailview">
            {renderMedia()}

            <div className="detailview__main">
                <div className="detailview__grid">
                    {fields.map((f, idx) => (
                        <div className="detailview__field" key={idx}>
                            <div className="detailview__label">{f.label}</div>
                            <div className="detailview__value">{f.value ?? '-'}</div>
                        </div>
                    ))}

                    {status && (
                        <div className="detailview__field">
                            <div className="detailview__label">Status</div>
                            <div className="detailview__value">{status}</div>
                        </div>
                    )}
                </div>
            </div>

            {aside && <div className="detailview__aside">{aside}</div>}
        </div>
    );
}
