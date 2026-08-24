"use client";
import { useState, useEffect } from "react";
import { generatePDF } from "./utils/pdfGenerator";
import { LOGO_WHITE } from "./utils/pdfGenerator";

export default function Page() {
  const [theme, setTheme] = useState("standard");
  const [clientName, setClientName] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [date, setDate] = useState("");

  const [packages, setPackages] = useState([
    {
      name: "Reels and Content Creation",
      reelsCount: "",
      expertsCount: "",
      equipment: "iPhones / Drone / Camera",
      shootTime: "",
      additional: [""],
      originalPrice: "",
      discountedPrice: ""
    }
  ]);

  const [gstNote, setGstNote] = useState("Exclusive of GST");

  // Additional Information
  const [paymentTerms, setPaymentTerms] = useState("50% advance, 50% upon completion");
  const [customization, setCustomization] = useState("Services can be tailored to meet specific requirements.");
  const [watermark, setWatermark] = useState("Final edited videos will be delivered without the ReelOnGo watermark.");
  const [revisionPolicy, setRevisionPolicy] = useState("Clients are entitled to 1 round of revisions per video. All changes must be shared together after receiving the first draft. Additional revisions may be chargeable.");
  const [manualPoints, setManualPoints] = useState([""]);

  const [slots, setSlots] = useState([
    { slotName: "Slot 1", date: "", location: "", duration: "", reels: "" }
  ]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    setQuotationNo(`ROG-${new Date().getFullYear()}-0001`);
  }, [theme]);

  const addPackage = () => {
    setPackages([...packages, { name: "Reels and Content Creation", reelsCount: "", expertsCount: "", equipment: "iPhones / Drone / Camera", shootTime: "", additional: [""], originalPrice: "", discountedPrice: "" }]);
  };

  const rmPackage = (i) => {
    if (packages.length > 1) {
      const p = [...packages];
      p.splice(i, 1);
      setPackages(p);
    }
  };

  const handlePackageChange = (i, field, val) => {
    const p = [...packages];
    p[i][field] = val;
    setPackages(p);
  };

  const handleAddDeliverable = (pkgIndex) => {
    const p = [...packages];
    p[pkgIndex].additional.push("");
    setPackages(p);
  };

  const handleRemoveDeliverable = (pkgIndex, addIndex) => {
    const p = [...packages];
    p[pkgIndex].additional.splice(addIndex, 1);
    setPackages(p);
  };

  const handleDeliverableChange = (pkgIndex, addIndex, val) => {
    const p = [...packages];
    p[pkgIndex].additional[addIndex] = val;
    setPackages(p);
  };

  const handleAddManualPoint = () => {
    setManualPoints([...manualPoints, ""]);
  };

  const handleRemoveManualPoint = (i) => {
    const m = [...manualPoints];
    m.splice(i, 1);
    setManualPoints(m);
  };

  const handleManualPointChange = (i, val) => {
    const m = [...manualPoints];
    m[i] = val;
    setManualPoints(m);
  };

  const addSlot = () => {
    setSlots([...slots, { slotName: `Slot ${slots.length + 1}`, date: "", location: "", duration: "", reels: "" }]);
  };

  const rmSlot = (i) => {
    const s = [...slots];
    s.splice(i, 1);
    setSlots(s);
  };

  const handleSlotChange = (i, field, val) => {
    const s = [...slots];
    s[i][field] = val;
    setSlots(s);
  };

  const clearForm = () => {
    setTheme("standard");
    setClientName("");
    setQuotationNo(`ROG-${new Date().getFullYear()}-0001`);
    setDate("");
    setPackages([{ name: "Reels & Content Creation", reelsCount: "", expertsCount: "", equipment: "iPhones / Drone / Camera", shootTime: "", additional: [""], originalPrice: "", discountedPrice: "" }]);
    setGstNote("Exclusive of GST");
    setManualPoints([""]);
    setSlots([{ slotName: "Slot 1", date: "", location: "", duration: "", reels: "" }]);
  };

  const doGenerate = () => {
    const services = packages.map(pkg => ({
      packageName: pkg.name,
      reels: pkg.reelsCount,
      experts: pkg.expertsCount,
      equipment: pkg.equipment,
      shootTime: pkg.shootTime,
      deliverables: pkg.additional,
      price: pkg.originalPrice,
      discountedPrice: pkg.discountedPrice
    }));

    const shootSchedule = slots.filter(s => s.date || s.location || s.duration || s.reels);

    generatePDF({
      clientName, 
      quotationNo, 
      services, 
      gstNote,
      paymentTerms, 
      watermarkPolicy: watermark, 
      revisionPolicy, 
      customization,
      manualPoints,
      shootSchedule
    });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo-wrap">
          <img id="sidebar-logo" src={LOGO_WHITE} alt="Logo" className="sidebar-logo" />
        </div>
        

        <div className="sidebar-title">ReelOnGo</div>
        <div className="sidebar-sub">Quotation Generator</div>
      </aside>

      <main className="main">
        <div className="page-top">
          <div>
            <h1 className="page-title">Create Proposal</h1>
            <p className="page-sub">Fill in the details below to generate a new quotation</p>
          </div>
        </div>
        
        <div className="sec">
          <div className="sec-head">1. General Info</div>
          <div className="g2">
            <div className="field">
              <label>Client / Company Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Corp" />
            </div>
            <div className="field">
              <label>Quotation No</label>
              <input type="text" value={quotationNo} onChange={e => setQuotationNo(e.target.value)} />
            </div>
          </div>
          <div class="g2">
            <div className="field">
              <label>Date (Auto-generated in PDF)</label>
              <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="DD Month YYYY" disabled style={{background: '#f0f0f0'}} />
            </div>
            <div className="field">
              
            </div>
          </div>
        </div>

        <hr className="sec-divider" />

        <div className="sec">
          <div className="sec-head" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>2. Packages & Services</span>
            <button className="add-event-btn" onClick={addPackage} style={{fontSize: '11px', fontWeight: 'bold'}}>+ Add Package</button>
          </div>
          
          {packages.map((pkg, i) => (
            <div key={i} className="del-card" style={{marginBottom: '16px', paddingBottom: '12px'}}>
              <div className="del-row" style={{background: 'var(--surface)', padding: '10px 14px', borderBottom: '1px solid var(--border)'}}>
                <div style={{fontWeight: '600', fontSize: '13px', color: 'var(--brand)'}}>Package {i + 1}</div>
                <div style={{textAlign: 'right'}}>
                  {packages.length > 1 && <button onClick={() => rmPackage(i)} className="add-event-btn" style={{color: '#c0392b'}}>Remove</button>}
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">Package Type</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <select style={{width: '100%'}} value={pkg.name} onChange={e => handlePackageChange(i, 'name', e.target.value)}>
                    <option value="Reels and Content Creation">Reels and Content Creation</option>
                    <option value="Monthly Package">Monthly Package</option>
                  </select>
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">No. of Reels</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%'}} type="text" value={pkg.reelsCount} onChange={e => handlePackageChange(i, 'reelsCount', e.target.value)} placeholder="e.g. 10" />
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">ReelOnGo Experts</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%'}} type="text" value={pkg.expertsCount} onChange={e => handlePackageChange(i, 'expertsCount', e.target.value)} placeholder="e.g. 1" />
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">Equipment</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%'}} type="text" value={pkg.equipment} onChange={e => handlePackageChange(i, 'equipment', e.target.value)} placeholder="e.g. iPhones / Drone" />
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">Shoot Hours</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%'}} type="text" value={pkg.shootTime} onChange={e => handlePackageChange(i, 'shootTime', e.target.value)} placeholder="e.g. 4 hours" />
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label">Original Price (₹)</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%'}} type="text" value={pkg.originalPrice} onChange={e => handlePackageChange(i, 'originalPrice', e.target.value)} placeholder="e.g. 50000" />
                </div>
              </div>
              <div className="del-row">
                <div className="del-row-label" style={{color: 'var(--brand2)'}}>Discounted Price (₹)</div>
                <div className="del-row-input" style={{flex: 1}}>
                  <input style={{width: '100%', borderColor: 'var(--brand)'}} type="text" value={pkg.discountedPrice} onChange={e => handlePackageChange(i, 'discountedPrice', e.target.value)} placeholder="e.g. 45000" />
                </div>
              </div>
              
              <div className="del-row" style={{alignItems: "stretch", flexDirection: "column", display: "block"}}>
                <div style={{display: "grid", gridTemplateColumns: "200px 1fr"}}>
                  <div className="del-row-label" style={{alignSelf: "stretch"}}>Additional Deliverables</div>
                  <div style={{padding: "6px 8px", display: "flex", flexDirection: "column", gap: 0}}>
                    {pkg.additional.map((add, j) => (
                      <div key={j} className="event-row" style={{display: "flex", alignItems: "center", gap: "6px", padding: "5px 0", borderTop: j === 0 ? "none" : ".5px solid var(--border)"}}>
                        <input
                          type="text"
                          placeholder="e.g. Raw footage access"
                          value={add}
                          onChange={e => handleDeliverableChange(i, j, e.target.value)}
                          style={{flex: 1, fontSize: "12.5px", padding: "6px 10px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}}
                        />
                        <button className="event-rm" onClick={() => handleRemoveDeliverable(i, j)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding: "4px 14px 8px 214px"}}>
                  <button className="add-event-btn" onClick={() => handleAddDeliverable(i)}>+ Add Deliverable</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="sec-divider" />

        <div className="sec">
          <div className="sec-head">3. Additional Information</div>
          <div className="del-card">
            <div className="del-row">
              <div className="del-row-label">Payment Terms</div>
              <div className="del-row-input"><input style={{width: '100%'}} type="text" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} /></div>
            </div>
            <div className="del-row">
              <div className="del-row-label">Customization</div>
              <div className="del-row-input"><input style={{width: '100%'}} type="text" value={customization} onChange={e => setCustomization(e.target.value)} /></div>
            </div>
            <div className="del-row">
              <div className="del-row-label">Watermark</div>
              <div className="del-row-input"><input style={{width: '100%'}} type="text" value={watermark} onChange={e => setWatermark(e.target.value)} /></div>
            </div>
            <div className="del-row">
              <div className="del-row-label">Revision Policy</div>
              <div className="del-row-input"><textarea style={{width: '100%', border: 'none', background: 'transparent'}} rows={3} value={revisionPolicy} onChange={e => setRevisionPolicy(e.target.value)} /></div>
            </div>
            
            <div className="del-row" style={{alignItems: "stretch", flexDirection: "column", display: "block"}}>
              <div style={{display: "grid", gridTemplateColumns: "200px 1fr"}}>
                <div className="del-row-label" style={{alignSelf: "stretch"}}>Manual Points</div>
                <div style={{padding: "6px 8px", display: "flex", flexDirection: "column", gap: 0}}>
                  {manualPoints.map((add, j) => (
                    <div key={j} className="event-row" style={{display: "flex", alignItems: "center", gap: "6px", padding: "5px 0", borderTop: j === 0 ? "none" : ".5px solid var(--border)"}}>
                      <input
                        type="text"
                        placeholder="e.g. Custom point"
                        value={add}
                        onChange={e => handleManualPointChange(j, e.target.value)}
                        style={{flex: 1, fontSize: "12.5px", padding: "6px 10px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}}
                      />
                      <button className="event-rm" onClick={() => handleRemoveManualPoint(j)}>×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding: "4px 14px 8px 214px"}}>
                <button className="add-event-btn" onClick={handleAddManualPoint}>+ Add Point</button>
              </div>
            </div>
          </div>
        </div>

        <hr className="sec-divider" />

        <div className="sec">
          <div className="sec-head" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>4. Shoot Schedule (Optional)</span>
          </div>
          <p className="hint" style={{marginBottom: '10px'}}>Leave empty if not applicable. Used for multi-slot/multi-day shoots.</p>
          
          <div className="del-card" style={{alignItems: "stretch", flexDirection: "column", display: "block"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr"}}>
              <div style={{padding: "6px 8px", display: "flex", flexDirection: "column", gap: 0}}>
                {slots.map((s, i) => (
                  <div key={i} className="event-row" style={{display: "flex", alignItems: "center", gap: "6px", padding: "5px 0", borderTop: i === 0 ? "none" : ".5px solid var(--border)"}}>
                    <input type="text" value={s.slotName} onChange={e => handleSlotChange(i, 'slotName', e.target.value)} placeholder="Slot Name" style={{width: '100px', fontSize: "12.5px", padding: "6px 10px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}} />
                    <input type="text" value={s.date} onChange={e => handleSlotChange(i, 'date', e.target.value)} placeholder="Date" style={{width: '120px', fontSize: "12px", padding: "6px 8px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}} />
                    <input type="text" value={s.location} onChange={e => handleSlotChange(i, 'location', e.target.value)} placeholder="Location" style={{flex: 1, fontSize: "12px", padding: "6px 8px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}} />
                    <input type="text" value={s.duration} onChange={e => handleSlotChange(i, 'duration', e.target.value)} placeholder="Duration" style={{width: '100px', fontSize: "12px", padding: "6px 8px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}} />
                    <input type="text" value={s.reels} onChange={e => handleSlotChange(i, 'reels', e.target.value)} placeholder="Reels" style={{width: '100px', fontSize: "12px", padding: "6px 8px", border: "none", borderRadius: "5px", background: "var(--surface)", color: "var(--ink)", outline: "none"}} />
                    <button className="event-rm" onClick={() => rmSlot(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding: "8px 14px"}}>
              <button className="add-btn" onClick={addSlot}>+ Add Slot</button>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="btn-s" onClick={clearForm}>Clear Form</button>
          <button className="btn-p" onClick={doGenerate}>Generate PDF</button>
        </div>

      </main>
    </div>
  );
}
