import React from 'react'
require('../../assets/font/iconfont.js');

export function MyIcon(props){
  return (
    <svg className={`myIcon ${props.name}`} aria-hidden="true">
      <use xlinkHref={`#${props.type}`}>
        <style>
          {`
            .myIcon{
              width:1em;
              height:1em;
              fill:currentColor;
              overflow:hidden;
            }
          `}
        </style>
      </use>
    </svg>
  )
}
