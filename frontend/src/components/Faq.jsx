import React from "react";
import pdfmanual1 from "../assets/m1.pdf";
import pdfmanual2 from "../assets/m2.pdf";

const Faq = () => {
  return (
    <div className='container'>
      <div className='jumbotron mt-5'>
        <div className='col-sm-8 mx-auto'>
          <iframe width="700" height="415" src="https://www.youtube.com/embed/QX-zdWPU7xQ?si=yz6PkkuNu77MNitC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

          <object data={pdfmanual1} type="application/pdf" width={700} height={550}></object>
          <object data={pdfmanual2} type="application/pdf" width={700} height={550}></object>
        </div>
      </div>
    </div>
  );
};

export default Faq;
