import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Easy to Use",
    description: (
      <>
        Accent is built for easy and fast development, with a simple API built
        for applications of all sizes.
      </>
    ),
  },
  {
    title: "Fully Modular",
    description: (
      <>
        Accent is made up of different standalone modules, or "libraries" that
        work together. You use only what you need for your project.
      </>
    ),
  },
  {
    title: "Lightweight",
    description: (
      <>
        Accent is fast and allows you to write fully optimized and secure web
        applications in minutes.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
