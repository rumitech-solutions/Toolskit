/* Phase 2 SEO profiles: task-focused content and related-tool discovery. */
import {tools} from './toolRegistry'
import type {ToolDefinition} from './types'

export type ToolSeoProfile = {
  intro:string
  bestFor:string[]
  workflow:string[]
  tips:string[]
  faq:{question:string;answer:string}[]
}

const categoryGuidance:Record<ToolDefinition['category'],Omit<ToolSeoProfile,'faq'>>={
 Text:{
  intro:'A focused browser utility for cleaning, counting, comparing, and transforming text without installing a separate editor.',
  bestFor:['content cleanup','editing and proofreading workflows','quick text transformations'],
  workflow:['Paste or type your text into the editor.','Choose the transformation or options you need.','Run the tool and review the result.','Copy the finished text into your document, CMS, or project.'],
  tips:['Paste representative text rather than a small sample when checking counts or formatting.','Review the result before replacing your original content.','Keep a copy of important source text before bulk transformations.']
 },
 Developer:{
  intro:'A browser-based developer utility for common formatting, encoding, conversion, inspection, and debugging tasks.',
  bestFor:['API and payload cleanup','debugging and development workflows','quick data transformations'],
  workflow:['Paste the data, code, token, or value you need to inspect.','Set any format, encoding, or validation options.','Run the tool and inspect the result or diagnostic output.','Copy the output into your terminal, editor, API client, or project.'],
  tips:['Validate the output before using it in production code.','Treat tokens, credentials, and secrets as sensitive even when processing happens locally.','For large payloads, keep an original copy so you can compare changes.']
 },
 PDF:{
  intro:'A browser-first PDF utility for common document operations, with supported file processing performed locally in the browser.',
  bestFor:['quick document preparation','page-level PDF changes','private browser-based file workflows'],
  workflow:['Choose one or more PDF files from your device.','Set the page, order, quality, or watermark options where available.','Run the operation and wait for processing to finish.','Download the resulting PDF or ZIP package.'],
  tips:['Keep the original PDF until you have checked the result.','Large PDFs can use significant browser memory during processing.','Local processing means the selected file can stay on your device for supported tools.']
 },
 Image:{
  intro:'A browser-based image utility for common compression, resizing, cropping, conversion, and metadata tasks.',
  bestFor:['web image preparation','format conversion','quick size and quality adjustments'],
  workflow:['Choose an image from your device.','Set quality, dimensions, or output format when available.','Run the image operation.','Download and inspect the converted image.'],
  tips:['Use a copy when experimenting with aggressive compression.','Check dimensions and visual quality after resizing.','Choose WebP for compatible web workflows when smaller files are useful.']
 },
 Calculators:{
  intro:'A focused calculator for getting a quick numerical answer without opening a spreadsheet or installing an app.',
  bestFor:['everyday calculations','planning and estimation','quick reference while working or studying'],
  workflow:['Enter the values required by the calculator.','Check the selected units or assumptions.','Run the calculation and review the result.','Recheck important figures independently before making decisions.'],
  tips:['Use the same units throughout the inputs.','Double-check percentages, rates, and dates before relying on the result.','Treat financial and health-related outputs as estimates, not professional advice.']
 },
 Security:{
  intro:'A lightweight browser utility for password generation, hashing, encoding, identifiers, and related technical tasks.',
  bestFor:['development and testing','local security helpers','quick hashing or generation tasks'],
  workflow:['Enter the value or choose the generation settings you need.','Run the operation in the browser.','Review the generated or transformed result.','Copy or download only what you actually need.'],
  tips:['Never paste private credentials or secrets unnecessarily.','Use cryptographically secure generation for passwords and identifiers when the tool provides it.','Hashing is not encryption, and a digest should not be treated as reversible.']
 }
,
 Finance:{
  intro:'A focused finance calculator for quick estimates of tax, margin, return or pay without a spreadsheet.',
  bestFor:['pricing and budgeting','investment planning','quick money checks'],
  workflow:['Enter your figures.','Check the rate, period and assumptions.','Review the result breakdown.','Confirm important numbers independently.'],
  tips:['Results are estimates, not financial advice.','Use consistent currency and periods.','Rates and fees vary, so verify with your provider.']
 },
 Health:{
  intro:'A simple health and fitness calculator that turns well-known formulas into a quick estimate.',
  bestFor:['fitness planning','training sessions','daily wellness habits'],
  workflow:['Enter your measurements.','Select your activity level or goal.','Review the estimate.','Adjust over time based on real results.'],
  tips:['Estimates vary between individuals.','This is not medical advice.','Consult a professional for health conditions.']
 },
 Design:{
  intro:'A browser-based design utility for colors, CSS and web visuals with instant previews.',
  bestFor:['web and UI design','front-end development','branding experiments'],
  workflow:['Choose your colors or values.','Preview the result live.','Tweak until it looks right.','Copy the CSS or code into your project.'],
  tips:['Check color contrast for accessibility.','Test designs on light and dark backgrounds.','Keep a copy of final values in your design system.']
 },
 Productivity:{
  intro:'A quick everyday helper that works instantly in your browser without an account.',
  bestFor:['everyday tasks','sharing and scheduling','games and decisions'],
  workflow:['Enter your input.','Choose the options you need.','Review the result.','Copy or download it.'],
  tips:['Double-check results before sharing them.','Test QR codes before printing.','Confirm time zones for the exact date.']
 }
,
 Converters:{
  intro:'A fast unit converter that shows your value in every related unit at once.',
  bestFor:['cooking and DIY','travel and shopping','school and engineering work'],
  workflow:['Enter the value.','Choose the unit you have and the unit you need.','Read the main result and the full table.','Copy the number you need.'],
  tips:['Check US versus imperial units.','Round only at the end of a calculation.','Use the full table to compare units.']
 }
}

const overrides:Record<string,Partial<ToolSeoProfile>>={
 'length-converter':{
  intro:'Convert meters, kilometers, miles, feet, inches and more. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Pick the unit you have and the one you need; the other units are listed too.'],
  faq:[{question:'How many feet are in a meter?',answer:'One meter equals about 3.2808 feet. The converter shows every unit at once.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Length Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'weight-converter':{
  intro:'Convert kilograms, pounds, ounces, grams, stone and tonnes. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Use the full table to compare several units at once.'],
  faq:[{question:'How many pounds is a kilogram?',answer:'One kilogram equals about 2.2046 pounds.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Weight Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'temperature-converter':{
  intro:'Convert Celsius, Fahrenheit, Kelvin and Rankine. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Negative temperatures are supported.'],
  faq:[{question:'How do I convert Celsius to Fahrenheit?',answer:'Multiply by 9/5 and add 32. The tool does this instantly for any value.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Temperature Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'area-converter':{
  intro:'Convert square meters, acres, hectares, square feet and more. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Check whether a listing uses square feet or square meters.'],
  faq:[{question:'How many square feet are in an acre?',answer:'One acre is 43,560 square feet.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Area Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'volume-converter':{
  intro:'Convert liters, gallons, cups, tablespoons and milliliters. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Cooking recipes often mix cups, tablespoons and milliliters.'],
  faq:[{question:'Are US and UK gallons the same?',answer:'No. A US gallon is 3.785 L; an imperial (UK) gallon is 4.546 L. Both are available.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Volume Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'speed-converter':{
  intro:'Convert km/h, mph, m/s, knots and Mach. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Mach depends on altitude; this tool uses sea-level speed of sound.'],
  faq:[{question:'How do I convert mph to km/h?',answer:'Multiply miles per hour by 1.609344.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Speed Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'data-storage-converter':{
  intro:'Convert bits, bytes, KB, MB, GB, TB and binary KiB, MiB, GiB. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Operating systems often show GiB but label it GB.'],
  faq:[{question:'What is the difference between GB and GiB?',answer:'GB uses 1,000-based units; GiB uses 1,024-based units, so 1 GiB is about 1.074 GB.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Data Storage Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'pressure-converter':{
  intro:'Convert Pa, kPa, bar, psi, atm and mmHg. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Tyre pressure is usually quoted in psi or bar.'],
  faq:[{question:'How many psi is one bar?',answer:'One bar is about 14.504 psi.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Pressure Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'energy-converter':{
  intro:'Convert joules, calories, kWh, BTU and foot-pounds. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Electricity bills use kWh.'],
  faq:[{question:'Is a food Calorie the same as a calorie?',answer:'A food "Calorie" is a kilocalorie (kcal), or 1,000 small calories.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Energy Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'angle-converter':{
  intro:'Convert degrees, radians, gradians, arcminutes and turns. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Many programming languages use radians for trig functions.'],
  faq:[{question:'How many degrees is pi radians?',answer:'Pi radians equals 180 degrees.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Angle Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'fuel-economy-converter':{
  intro:'Convert mpg (US and UK), km/L and L/100 km. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Lower L/100 km means better efficiency, while higher mpg is better.'],
  faq:[{question:'Why do US and UK mpg differ?',answer:'The UK gallon is larger than the US gallon, so UK mpg figures are about 20% higher.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Fuel Economy Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'power-converter':{
  intro:'Convert watts, kilowatts, megawatts and horsepower. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Metric horsepower (PS) is slightly smaller than mechanical hp.'],
  faq:[{question:'How many kW is one horsepower?',answer:'One mechanical horsepower is about 0.7457 kW.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Power Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'number-to-words':{
  intro:'Convert numbers to English words, including cheque amounts. Free, instant and private in your browser.',
  bestFor:['quick conversions','cooking, travel and DIY','school and engineering work'],
  tips:['Check the amount in words matches the figures.'],
  faq:[{question:'How do I write a number as words on a cheque?',answer:'Enter the amount with up to two decimals; the tool also gives the "and 50/100" cheque style.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Number to Words Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'mortgage-calculator':{
  intro:'Estimate monthly mortgage payments with tax and insurance. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Compare a 15-year and a 30-year term to see the interest difference.'],
  faq:[{question:'What is included in the monthly payment?',answer:'Principal and interest, plus the property tax and insurance you enter.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Mortgage Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'savings-goal-calculator':{
  intro:'Find the monthly saving needed to reach a target amount. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Include interest only if your account actually pays it.'],
  faq:[{question:'How is the monthly amount calculated?',answer:'It solves for the monthly deposit that grows, with interest, to your goal in the chosen time.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Savings Goal Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'inflation-calculator':{
  intro:'See how inflation changes prices and buying power over time. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Run several rates to see a range.'],
  faq:[{question:'What inflation rate should I use?',answer:'Use your country’s long-run average, often 2–4% per year.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Inflation Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'break-even-calculator':{
  intro:'Find the units and revenue needed to cover your costs. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Add every fixed cost, including rent and salaries.'],
  faq:[{question:'What is the break-even point?',answer:'The sales volume at which total revenue equals total costs.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Break-Even Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'cagr-calculator':{
  intro:'Calculate compound annual growth rate for investments or revenue. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['CAGR smooths volatility, so it hides year-to-year swings.'],
  faq:[{question:'What does CAGR mean?',answer:'It is the steady yearly growth rate that takes a starting value to an ending value over a period.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use CAGR Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'retirement-calculator':{
  intro:'Estimate retirement savings and sustainable monthly income. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Be conservative with expected returns.'],
  faq:[{question:'What is the 4% rule?',answer:'It suggests you can withdraw about 4% of your savings in year one of retirement and adjust for inflation.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Retirement Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'credit-card-payoff-calculator':{
  intro:'See how long it takes to clear a card balance and the interest. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['Paying a little extra each month saves a lot of interest.'],
  faq:[{question:'Why must my payment exceed the interest?',answer:'If it does not, the balance never goes down.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Credit Card Payoff Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'fixed-deposit-calculator':{
  intro:'Calculate maturity value and interest on a fixed deposit. Free, instant and private in your browser.',
  bestFor:['money planning','quick financial estimates','comparing options'],
  tips:['More frequent compounding gives slightly higher returns.'],
  faq:[{question:'How often does interest compound?',answer:'It depends on the bank. Choose yearly, half-yearly, quarterly or monthly.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Fixed Deposit Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'bmr-calculator':{
  intro:'Calculate basal metabolic rate and maintenance calories. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Maintenance calories multiply BMR by an activity factor.'],
  faq:[{question:'What is BMR?',answer:'Basal metabolic rate is the energy your body uses at rest.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use BMR Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'body-fat-calculator':{
  intro:'Estimate body fat percentage with the US Navy method. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Measure at the same time of day, relaxed, using a soft tape.'],
  faq:[{question:'How accurate is the Navy method?',answer:'It is a quick estimate, typically within a few percentage points.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Body Fat Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'ideal-weight-calculator':{
  intro:'Estimate ideal body weight with four common formulas. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Use BMI and body fat alongside for context.'],
  faq:[{question:'Is there one ideal weight?',answer:'No. These formulas give a range and ignore muscle mass, frame and age.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Ideal Weight Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'macro-calculator':{
  intro:'Turn calories into grams of protein, carbs and fat. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Track protein first for muscle goals.'],
  faq:[{question:'How do I choose a macro split?',answer:'Pick the style closest to your goal. You can adjust grams afterwards.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Macro Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'due-date-calculator':{
  intro:'Estimate a due date from the first day of your last period. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Your doctor’s ultrasound dating is more accurate.'],
  faq:[{question:'How is the due date calculated?',answer:'Naegele’s rule adds 280 days to the first day of the last menstrual period.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Pregnancy Due Date Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'sleep-calculator':{
  intro:'Find the best bedtime or wake-up time using 90-minute cycles. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Allow for the time it takes you to fall asleep.'],
  faq:[{question:'Why 90-minute cycles?',answer:'A typical sleep cycle lasts about 90 minutes; waking between cycles tends to feel easier.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Sleep Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'protein-intake-calculator':{
  intro:'Estimate daily protein needs based on weight and goal. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Spread protein across meals.'],
  faq:[{question:'How much protein do I need?',answer:'Roughly 0.8 g per kg for sedentary adults and up to 2 g per kg when building muscle.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Protein Intake Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'waist-hip-ratio-calculator':{
  intro:'Calculate waist-to-hip ratio and a WHO risk reference. Free, instant and private in your browser.',
  bestFor:['fitness planning','wellness tracking','quick reference values'],
  tips:['Measure at the narrowest waist and widest hip.'],
  faq:[{question:'What is a healthy waist-to-hip ratio?',answer:'WHO suggests below 0.90 for men and 0.85 for women.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Waist-to-Hip Ratio Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'color-shades-generator':{
  intro:'Generate a 10-step tint and shade scale from any color. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Check contrast before pairing steps.'],
  faq:[{question:'How do I use the scale?',answer:'Use light steps for backgrounds and dark steps for text or borders.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Color Shades Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'glassmorphism-generator':{
  intro:'Create frosted-glass CSS with blur, transparency and border. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Glass works best over colourful backgrounds.'],
  faq:[{question:'Does backdrop-filter work everywhere?',answer:'All modern browsers support it; add a solid fallback for older ones.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Glassmorphism CSS Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'border-radius-generator':{
  intro:'Design rounded corners per corner and copy the CSS. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Different values per corner give organic shapes.'],
  faq:[{question:'How do I make a circle?',answer:'Use a square element with a border-radius of 50%.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use CSS Border Radius Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'text-shadow-generator':{
  intro:'Build CSS text shadows with a live preview. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Keep contrast high for readable text.'],
  faq:[{question:'How do I make a glow?',answer:'Use zero offsets and a larger blur with a bright color.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use CSS Text Shadow Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'css-clamp-generator':{
  intro:'Create fluid font sizes with the CSS clamp() function. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Use rem units so zoom and user settings still work.'],
  faq:[{question:'What does clamp() do?',answer:'It picks a value between a minimum and maximum that scales with the viewport.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use CSS Clamp Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'rgb-to-hex-converter':{
  intro:'Convert RGB values to HEX and HSL with a color preview. Free, instant and private in your browser.',
  bestFor:['web and UI design','front-end development','quick visual experiments'],
  tips:['Copy the format your CSS needs.'],
  faq:[{question:'How do I convert RGB to HEX?',answer:'Convert each channel (0–255) to two hex digits and join them, like #6366f1.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use RGB to HEX Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'business-days-calculator':{
  intro:'Count working days between two dates, excluding weekends. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Check whether the end date counts.'],
  faq:[{question:'Are public holidays excluded?',answer:'No, only weekends are excluded. Subtract holidays yourself.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Business Days Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'week-number-calculator':{
  intro:'Find the ISO week number, quarter and day of year for a date. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Some calendars start weeks on Sunday and differ.'],
  faq:[{question:'What is an ISO week?',answer:'ISO weeks start on Monday, and week 1 contains the first Thursday of the year.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Week Number Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'day-of-week-calculator':{
  intro:'Find out which weekday any date falls on. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Works for any date in the Gregorian calendar.'],
  faq:[{question:'What day was I born?',answer:'Choose your birth date to see the weekday.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Day of the Week Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'meeting-cost-calculator':{
  intro:'See how much a meeting costs in salary time. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Use a loaded hourly rate for accuracy.'],
  faq:[{question:'Why calculate meeting cost?',answer:'It highlights the real cost of long meetings and large invite lists.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Meeting Cost Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'work-hours-calculator':{
  intro:'Calculate daily, weekly and yearly hours from start and end times. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Enter unpaid break time in minutes.'],
  faq:[{question:'Does it handle overnight shifts?',answer:'Yes, if the end time is earlier than the start time it assumes the next day.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Work Hours Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'lottery-number-generator':{
  intro:'Generate random lottery lines with unique numbers. Free, instant and private in your browser.',
  bestFor:['planning and scheduling','everyday tasks','saving time'],
  tips:['Set the highest number to match your game.'],
  faq:[{question:'Do these numbers improve my odds?',answer:'No. Every combination is equally likely.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Lottery Number Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'text-repeater':{
  intro:'Repeat any text up to 1,000 times with a separator. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Use a new line separator for lists.'],
  faq:[{question:'Is there a limit?',answer:'You can repeat up to 1,000 times per run.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Text Repeater?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'anagram-checker':{
  intro:'Check whether two words or phrases are anagrams. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Useful for word games and puzzles.'],
  faq:[{question:'Are spaces and case ignored?',answer:'Yes. Only letters and numbers are compared.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Anagram Checker?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'remove-accents':{
  intro:'Strip diacritics and accents from letters. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Handy for slugs, filenames and search keys.'],
  faq:[{question:'What does this do to “é”?',answer:'It becomes “e”. Special letters like ß become “ss”.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Remove Accents from Text?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'add-line-numbers':{
  intro:'Number every line of text with a custom start and separator. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Choose a tab separator to paste into spreadsheets.'],
  faq:[{question:'Can I start from a different number?',answer:'Yes, set any starting number.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Add Line Numbers to Text?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'upside-down-text':{
  intro:'Flip your text upside down with Unicode characters. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['A few characters may look different on some fonts.'],
  faq:[{question:'Where can I paste it?',answer:'Anywhere Unicode is supported, such as social profiles and chats.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Upside Down Text Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'emoji-remover':{
  intro:'Remove emoji and pictographs from text. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Review the cleaned text for extra spaces.'],
  faq:[{question:'Does it remove numbers or symbols?',answer:'No. Digits and symbols like # and * are kept.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Emoji Remover?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'title-case-converter':{
  intro:'Convert text to headline-style Title Case. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['Check proper nouns and brand names manually.'],
  faq:[{question:'Which words stay lowercase?',answer:'Short words like a, the, of and in stay lowercase unless they start the title.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Title Case Converter?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'hashtag-generator':{
  intro:'Turn phrases into clean, readable hashtags. Free, instant and private in your browser.',
  bestFor:['writing and editing','social media text','content cleanup'],
  tips:['CamelCase hashtags are easier to read and accessible to screen readers.'],
  faq:[{question:'How many hashtags should I use?',answer:'Most platforms work best with 3–10 relevant hashtags.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Hashtag Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'url-parser':{
  intro:'Break a URL into protocol, host, path, query and hash. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Include the https:// prefix.'],
  faq:[{question:'What parts does it show?',answer:'Protocol, username, hostname, port, path, query string, hash and each parameter.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use URL Parser?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'string-escape':{
  intro:'Escape or unescape strings for JSON, regex and SQL. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['For SQL, prefer parameterized queries over manual escaping.'],
  faq:[{question:'When do I need to escape strings?',answer:'Whenever text with quotes, newlines or special characters goes into code, JSON, SQL or a regex.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use String Escape & Unescape?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'mime-type-lookup':{
  intro:'Look up the MIME type for a file extension or vice versa. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Set the right Content-Type on your server.'],
  faq:[{question:'What is a MIME type?',answer:'A label such as image/png that tells browsers how to treat a file.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use MIME Type Lookup?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'port-number-lookup':{
  intro:'Find common TCP/UDP ports and the services that use them. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Avoid exposing databases on public ports.'],
  faq:[{question:'What port does HTTPS use?',answer:'HTTPS uses port 443.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Port Number Lookup?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'ip-address-validator':{
  intro:'Validate IPv4 and IPv6 addresses and see their type. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Leading zeros are not accepted in IPv4.'],
  faq:[{question:'What are private IP ranges?',answer:'10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 are private.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use IP Address Validator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'json-diff':{
  intro:'Compare two JSON documents and list every difference. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Format both JSON documents first for clearer results.'],
  faq:[{question:'How are arrays compared?',answer:'By index, so inserting an item shifts later positions.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use JSON Diff?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'jwt-generator':{
  intro:'Create signed HS256, HS384 or HS512 JSON Web Tokens. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Remember JWT payloads are encoded, not encrypted.'],
  faq:[{question:'Is it safe to use my real secret?',answer:'Use test secrets only; never paste production keys into a website.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use JWT Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'user-agent-parser':{
  intro:'Detect browser, OS and device from a user-agent string. Free, instant and private in your browser.',
  bestFor:['debugging and development','API work','quick lookups'],
  tips:['Parsing is heuristic and some agents are spoofed.'],
  faq:[{question:'Where do I find a user-agent?',answer:'In browser dev tools, server logs or analytics. Your own is pre-filled.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use User Agent Parser?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'passphrase-generator':{
  intro:'Generate memorable, strong passphrases from random words. Free, instant and private in your browser.',
  bestFor:['development and testing','account hygiene','quick security checks'],
  tips:['Use at least 5 words for important accounts.'],
  faq:[{question:'Why use a passphrase?',answer:'Several random words are easy to remember and hard to guess.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Passphrase Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'pin-generator':{
  intro:'Generate random numeric PINs that avoid easy patterns. Free, instant and private in your browser.',
  bestFor:['development and testing','account hygiene','quick security checks'],
  tips:['Never reuse the same PIN across services.'],
  faq:[{question:'Does it avoid 1234?',answer:'Yes, by default it skips repeated and sequential PINs.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use PIN Generator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'hash-identifier':{
  intro:'Identify likely hash types such as MD5, SHA-1, SHA-256 and bcrypt. Free, instant and private in your browser.',
  bestFor:['development and testing','account hygiene','quick security checks'],
  tips:['Several algorithms share a length, so treat the result as a hint.'],
  faq:[{question:'How does it identify a hash?',answer:'By its length, character set and any prefix such as $2b$.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Hash Identifier?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'fraction-calculator':{
  intro:'Add, subtract, multiply and divide fractions. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Denominators cannot be zero.'],
  faq:[{question:'Does it simplify the result?',answer:'Yes, results are reduced and shown as a mixed number and decimal.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Fraction Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'quadratic-equation-solver':{
  intro:'Solve ax² + bx + c = 0 with real or complex roots. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['The vertex gives the minimum or maximum.'],
  faq:[{question:'What if the discriminant is negative?',answer:'The roots are complex and shown with i.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Quadratic Equation Solver?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'gpa-calculator':{
  intro:'Calculate GPA on the 4.0 scale from grades and credits. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['One course per line, like "A- 3".'],
  faq:[{question:'Which scale does it use?',answer:'The common US 4.0 scale including plus and minus grades.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use GPA Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'grade-calculator':{
  intro:'Find your weighted grade and the score needed on the final. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Weights should add up to 100% with the final.'],
  faq:[{question:'How are weights used?',answer:'Each score is multiplied by its weight and divided by the total weight.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Grade Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'ohms-law-calculator':{
  intro:'Solve voltage, current, resistance and power from any two values. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Clear the fields you want to solve for.'],
  faq:[{question:'Which two values do I enter?',answer:'Any two of V, I, R and P; the others are calculated.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Ohm’s Law Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'fuel-cost-calculator':{
  intro:'Estimate the fuel needed and cost of a trip. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Use real-world consumption, not the brochure figure.'],
  faq:[{question:'Can I split costs?',answer:'Yes, enter the number of people sharing.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Fuel Cost Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'geometry-calculator':{
  intro:'Area, perimeter and volume for common shapes. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Use consistent units for all dimensions.'],
  faq:[{question:'Which shapes are supported?',answer:'Circle, rectangle, triangle, sphere, cylinder, cube and cone.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Geometry Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'ratio-calculator':{
  intro:'Solve A:B = C:? and simplify ratios. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['Good for recipes, maps and scaling designs.'],
  faq:[{question:'How does it solve for D?',answer:'It uses D = B × C ÷ A.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Ratio Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'average-calculator':{
  intro:'Mean, median, mode, range and more for a list of numbers. Free, instant and private in your browser.',
  bestFor:['homework and study','everyday calculations','quick checks'],
  tips:['The median is less affected by outliers.'],
  faq:[{question:'What is the difference between mean and median?',answer:'The mean is the sum divided by the count; the median is the middle value.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'},{question:'Do I need an account to use Average Calculator?',answer:'No account or sign-up is needed. Just open the tool and use it.'}]
 },
 'gst-vat-calculator':{
  intro:'Add GST, VAT or sales tax to a net price, or work backwards from a tax-inclusive total to find the original price and the tax amount.',
  bestFor:['invoices and quotes','shopping and price checks','small-business bookkeeping'],
  tips:['Check your local rules: some items are zero-rated or use reduced rates.'],
  faq:[{question:'How do I remove GST or VAT from a price?',answer:'Choose the "remove tax" mode, enter the tax-inclusive price and the rate. The tool divides by 1 + rate and shows the net price and the tax portion.'},{question:'Which tax rate should I enter?',answer:'Use the rate that applies in your country or for your product category. The calculator works with any percentage.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'profit-margin-calculator':{
  intro:'Work out gross profit, profit margin and markup from your cost and selling price, or find the price needed to reach a target margin.',
  bestFor:['pricing products','resellers and shops','freelancers quoting work'],
  tips:['Include shipping, fees and packaging in your cost for a realistic margin.'],
  faq:[{question:'What is the difference between margin and markup?',answer:'Margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost. A 50% markup equals a 33.3% margin.'},{question:'Does this include taxes and fees?',answer:'No. Enter your total cost including fees to get an accurate margin.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'roi-calculator':{
  intro:'Measure how much an investment or campaign earned relative to its cost, including an annualized figure when you enter the time held.',
  bestFor:['investment comparison','marketing campaign results','business decisions'],
  tips:['Include all costs and fees in the amount invested.'],
  faq:[{question:'How is ROI calculated?',answer:'ROI = (final value − amount invested) ÷ amount invested × 100.'},{question:'What is annualized ROI?',answer:'It converts the total return into an equivalent yearly rate so investments held for different periods can be compared.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'sip-calculator':{
  intro:'Estimate how a fixed monthly investment could grow over time at an assumed annual return rate.',
  bestFor:['retirement and goal planning','mutual fund SIP planning','comparing savings plans'],
  tips:['Try conservative return rates to see a range of outcomes.'],
  faq:[{question:'Are the returns guaranteed?',answer:'No. The result is an estimate based on the constant return you enter. Real markets fluctuate.'},{question:'How is the future value calculated?',answer:'It uses the standard annuity-due formula with monthly compounding at the rate you provide.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'salary-converter':{
  intro:'Convert pay between hourly, daily, weekly, bi-weekly, monthly and yearly figures using your own working schedule.',
  bestFor:['comparing job offers','freelance rate setting','budgeting'],
  tips:['Adjust weeks worked per year to account for unpaid leave.'],
  faq:[{question:'How are hourly and yearly pay related?',answer:'Yearly pay = hourly rate × hours per week × weeks per year. You can adjust both values.'},{question:'Is the result before or after tax?',answer:'It converts whatever figure you enter, so it is gross if you enter gross pay.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'calorie-calculator':{
  intro:'Estimate your basal metabolic rate, total daily energy expenditure and a calorie target for your goal using the Mifflin-St Jeor equation.',
  bestFor:['diet planning','fitness goals','understanding energy needs'],
  tips:['Re-check your numbers after significant weight changes.'],
  faq:[{question:'How accurate is a calorie calculator?',answer:'It gives an estimate. Individual metabolism varies, so adjust based on real-world progress over a few weeks.'},{question:'Is this medical advice?',answer:'No. Speak to a doctor or dietitian before making major diet changes.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'water-intake-calculator':{
  intro:'Get a simple estimate of daily water intake based on body weight, exercise and climate.',
  bestFor:['hydration habits','exercise planning','hot-weather days'],
  tips:['Drink more when exercising or in hot weather.'],
  faq:[{question:'How much water should I drink a day?',answer:'Needs vary by body size, activity and climate. This tool gives a reasonable estimate, not a medical target.'},{question:'Do other drinks and food count?',answer:'Yes, a portion of daily fluid comes from food and other beverages.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'pace-calculator':{
  intro:'Calculate your pace per kilometre or mile, finish time or speed from any two of distance, time and pace.',
  bestFor:['race planning','training runs','treadmill workouts'],
  tips:['Use the pace for race distance to plan even splits.'],
  faq:[{question:'How do I calculate my running pace?',answer:'Pace = total time ÷ distance. Enter your time and distance and the tool gives pace per km and per mile.'},{question:'Can I plan a race finish time?',answer:'Yes, enter a target pace and the distance to see the predicted finish time.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'heart-rate-zones':{
  intro:'Estimate maximum heart rate and the five training zones from your age and optional resting heart rate.',
  bestFor:['cardio training','weight-loss workouts','endurance building'],
  tips:['Use a lab test or a hard effort test for a precise maximum.'],
  faq:[{question:'How is max heart rate estimated?',answer:'The tool uses 220 − age, which is a population average. Individuals can differ.'},{question:'What is the Karvonen method?',answer:'It uses your heart-rate reserve (max − resting) so zones reflect your fitness level.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'color-palette-generator':{
  intro:'Build harmonious palettes from a base color using complementary, analogous, triadic, tetradic and monochrome rules.',
  bestFor:['brand and web design','UI mockups','presentations and posters'],
  tips:['Check text contrast with the Color Contrast Checker.'],
  faq:[{question:'What is a complementary color?',answer:'A color on the opposite side of the color wheel, which creates strong contrast.'},{question:'Can I copy the codes?',answer:'Yes, each swatch has a HEX value you can copy with one click.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'css-gradient-generator':{
  intro:'Design linear or radial gradients, preview them live and copy the CSS.',
  bestFor:['website backgrounds','buttons and cards','design prototypes'],
  tips:['Use subtle angle changes for polished backgrounds.'],
  faq:[{question:'Which browsers support CSS gradients?',answer:'All modern browsers support linear-gradient and radial-gradient.'},{question:'How do I use the CSS?',answer:'Paste the generated declaration into a rule such as background on any element.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'box-shadow-generator':{
  intro:'Tune offset, blur, spread, color and opacity of a box-shadow and copy the finished CSS.',
  bestFor:['cards and buttons','depth in UI design','neumorphism experiments'],
  tips:['Keep shadow opacity low for a natural look.'],
  faq:[{question:'What does blur radius do?',answer:'A larger blur makes the shadow softer and more spread out.'},{question:'Can I make an inset shadow?',answer:'Yes, toggle the inset option to place the shadow inside the box.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'px-to-rem-converter':{
  intro:'Convert between px, rem and em using a custom root font size and see a quick table of common values.',
  bestFor:['responsive design','accessible font sizing','CSS refactoring'],
  tips:['Set the base size to match your project root.'],
  faq:[{question:'How many px is 1rem?',answer:'By default 1rem is 16px, but it depends on the root font size of the page.'},{question:'Why use rem instead of px?',answer:'Rem units scale with user font-size settings, which improves accessibility.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'image-to-base64':{
  intro:'Convert an image into a Base64 data URI and ready-made HTML and CSS snippets, processed locally in your browser.',
  bestFor:['embedding small icons','email templates','single-file prototypes'],
  tips:['Compress large images before encoding.'],
  faq:[{question:'Is my image uploaded?',answer:'No. The file is read and encoded locally in your browser.'},{question:'When should I use Base64 images?',answer:'For small images only; Base64 adds about 33% to the size.'},{question:'Are files uploaded?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'fancy-text-generator':{
  intro:'Convert normal text into bold, italic, script, gothic, circled and many other Unicode styles that work in social bios and chat apps.',
  bestFor:['social media bios','usernames and captions','chat messages'],
  tips:['Avoid fancy text for important content because screen readers may not read it well.'],
  faq:[{question:'Where can I paste fancy text?',answer:'Almost anywhere that accepts Unicode, such as Instagram, X, Discord and WhatsApp.'},{question:'Why do some characters look like boxes?',answer:'A few apps or fonts do not support every Unicode character.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'bionic-reading-converter':{
  intro:'Emphasise the first part of every word so the eye can glide through text more quickly.',
  bestFor:['skimming long articles','study notes','reading comfort'],
  tips:['Adjust the fixation strength to suit your reading style.'],
  faq:[{question:'Does bionic reading really work?',answer:'Research is mixed. Some people find it more comfortable, others see no benefit, so try it yourself.'},{question:'Can I copy the result?',answer:'Yes, copy the formatted text for your own use.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'reading-time-calculator':{
  intro:'Estimate how long a text takes to read silently or speak aloud, using your own words-per-minute pace.',
  bestFor:['blog posts','speeches and presentations','video scripts'],
  tips:['Add pauses for slides or demos when timing a talk.'],
  faq:[{question:'What reading speed is used?',answer:'The default is around 238 words per minute for silent reading, and you can change it.'},{question:'How is speaking time estimated?',answer:'At about 150 words per minute, adjustable in the tool.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'readability-score-checker':{
  intro:'Score your writing with Flesch reading ease and Flesch-Kincaid grade level, plus word and sentence stats.',
  bestFor:['blog and SEO writing','student essays','plain-language checks'],
  tips:['Shorter sentences and simpler words raise the score.'],
  faq:[{question:'What is a good Flesch score?',answer:'Scores of 60–70 are considered plain English; higher is easier to read.'},{question:'Does it work for other languages?',answer:'The formulas are tuned for English, so results for other languages are only approximate.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'keyword-density-checker':{
  intro:'Analyse the most frequent words and phrases in your copy, excluding common stop words if you choose.',
  bestFor:['SEO content review','avoiding keyword stuffing','editing drafts'],
  tips:['Use phrases of two or three words for better insight.'],
  faq:[{question:'What keyword density is ideal?',answer:'There is no fixed number. Write naturally and avoid obvious repetition.'},{question:'Are stop words removed?',answer:'You can toggle stop-word filtering on or off.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'utm-link-builder':{
  intro:'Add UTM source, medium, campaign, term and content parameters to a URL so campaigns are tracked correctly in analytics.',
  bestFor:['marketing campaigns','newsletters','social media links'],
  tips:['Agree a naming convention with your team before launching.'],
  faq:[{question:'What are UTM parameters?',answer:'They are query-string tags that tell analytics tools where a visit came from.'},{question:'Are UTM values case-sensitive?',answer:'Yes. Keep naming consistent, for example always lowercase.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'time-zone-converter':{
  intro:'Convert a specific date and time between time zones and compare several cities at once, with daylight saving applied automatically.',
  bestFor:['scheduling meetings','remote teams','travel planning'],
  tips:['Pick the date of the event; offsets can differ across the year.'],
  faq:[{question:'Does it handle daylight saving time?',answer:'Yes. Conversions use the browser time zone database, so DST rules for the selected date apply.'},{question:'Which zones are supported?',answer:'Major cities and IANA time zones across the world.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'random-picker':{
  intro:'Draw one or several random winners from a list using the browser’s secure random generator.',
  bestFor:['giveaways and raffles','classroom choices','deciding where to eat'],
  tips:['Put one option per line.'],
  faq:[{question:'Is the pick really random?',answer:'Yes. It uses crypto.getRandomValues, a cryptographically secure source.'},{question:'Can I pick more than one?',answer:'Yes, choose how many winners to draw without repeats.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'dice-roller-coin-flip':{
  intro:'Roll any number of dice from d4 to d100 or flip a coin, with totals shown instantly.',
  bestFor:['board and tabletop games','quick decisions','teaching probability'],
  tips:['Use multiple dice for roleplaying games.'],
  faq:[{question:'Which dice are supported?',answer:'d4, d6, d8, d10, d12, d20 and d100, in any quantity.'},{question:'Is it fair?',answer:'Yes. Results use a cryptographically secure random source.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'qr-code-generator':{
  intro:'Create a QR code from any text or link, choose colors and error correction, and download it as SVG or PNG.',
  bestFor:['sharing links and menus','business cards and flyers','Wi-Fi and contact sharing'],
  tips:['Test the QR code with a phone before printing.'],
  faq:[{question:'Does the QR code expire?',answer:'No. The code simply encodes your text, so it never expires.'},{question:'Is my data sent to a server?',answer:'No. The QR code is generated entirely in your browser.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'json-to-typescript':{
  intro:'Paste JSON and generate TypeScript interfaces that match nested objects, arrays and mixed types.',
  bestFor:['typing API responses','prototyping models','migrating JavaScript projects'],
  tips:['Review generated types for fields that may be null.'],
  faq:[{question:'Does it detect optional fields?',answer:'Where array items differ, missing keys are marked optional.'},{question:'Is the JSON sent anywhere?',answer:'No. The conversion runs in your browser.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'chmod-calculator':{
  intro:'Toggle read, write and execute for owner, group and others and get both the octal and symbolic chmod value.',
  bestFor:['server administration','deployment scripts','learning Linux'],
  tips:['Avoid 777 on production systems.'],
  faq:[{question:'What does chmod 755 mean?',answer:'Owner can read, write and execute; group and others can read and execute.'},{question:'What does chmod 644 mean?',answer:'Owner can read and write; group and others can only read.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'cidr-subnet-calculator':{
  intro:'Enter an IPv4 address with a prefix length to see netmask, network and broadcast addresses, usable host range and host count.',
  bestFor:['network design','cloud VPC planning','certification study'],
  tips:['Remember that cloud providers often reserve extra addresses.'],
  faq:[{question:'What does /24 mean?',answer:'The first 24 bits are the network portion, giving 256 addresses and 254 usable hosts.'},{question:'Does it support IPv6?',answer:'Not yet, this tool covers IPv4.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'http-status-codes':{
  intro:'Search a reference of HTTP status codes from 1xx to 5xx with plain-English explanations.',
  bestFor:['API debugging','web development','SEO audits'],
  tips:['Return the most specific status code your API can.'],
  faq:[{question:'What is the difference between 301 and 302?',answer:'301 is a permanent redirect; 302 is temporary.'},{question:'What does 429 mean?',answer:'Too Many Requests: the client has been rate limited.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'random-string-generator':{
  intro:'Generate secure random strings, tokens and keys with your choice of length and character sets.',
  bestFor:['API keys and tokens','test data','temporary secrets'],
  tips:['Use at least 32 characters for secrets.'],
  faq:[{question:'Is the string cryptographically secure?',answer:'Yes. It is generated with crypto.getRandomValues in your browser.'},{question:'Is anything stored?',answer:'No. Generated strings are not saved or sent anywhere.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'hmac-generator':{
  intro:'Create HMAC signatures from a message and a secret key using SHA-256, SHA-384 or SHA-512.',
  bestFor:['webhook verification','API signing','debugging signatures'],
  tips:['Do not paste production secrets into any tool unnecessarily.'],
  faq:[{question:'What is HMAC used for?',answer:'HMAC verifies message integrity and authenticity using a shared secret.'},{question:'Is my secret key uploaded?',answer:'No. Everything is computed locally with the Web Crypto API.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'text-encryptor':{
  intro:'Encrypt a message with a password using AES-GCM and PBKDF2, then decrypt it later with the same password.',
  bestFor:['sharing private notes','protecting small secrets','learning cryptography'],
  tips:['Choose a long, unique passphrase.'],
  faq:[{question:'Can you recover a lost password?',answer:'No. The password is never stored, so lost passwords cannot be recovered.'},{question:'Which algorithm is used?',answer:'AES-GCM with a key derived via PBKDF2 and a random salt and IV.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'file-checksum-calculator':{
  intro:'Compute SHA-1, SHA-256, SHA-384 and SHA-512 checksums for a file, processed locally in your browser.',
  bestFor:['verifying downloads','file integrity checks','software releases'],
  tips:['Prefer SHA-256 or stronger over SHA-1.'],
  faq:[{question:'Is my file uploaded?',answer:'No. The file is hashed locally in your browser.'},{question:'How do I verify a download?',answer:'Compare the hash with the one published by the source; they must match exactly.'},{question:'Are files uploaded?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'word-counter':{
  intro:'Count words, characters, lines, sentences, and estimated reading time from a text sample in one place.',
  bestFor:['essay and article checks','social media and copy length checks','draft editing before publishing'],
  tips:['Reading time is an estimate based on an average reading pace.','Check the no-spaces character count when a platform has a character limit.']
 },
 'json-formatter':{
  intro:'Turn compact or hard-to-read JSON into an indented structure that is easier to inspect, debug, and copy.',
  bestFor:['API response inspection','configuration files','debugging nested JSON'],
  workflow:['Paste valid JSON into the editor.','Choose the indentation level.','Run the formatter and inspect the structured output.','Copy the formatted JSON into your editor or API workflow.'],
  tips:['Formatting does not change the JSON data itself; it changes its whitespace and presentation.','Run the JSON validator first when you suspect syntax problems.']
 },
 'json-validator':{
  intro:'Check whether a JSON value can be parsed as valid JSON before you send, store, or transform it.',
  bestFor:['API request and response checks','configuration validation','debugging syntax errors'],
  workflow:['Paste the JSON you want to check.','Run validation.','If it fails, inspect the input for quoting, commas, brackets, or value syntax.','Re-run validation after making the correction.']
 },
 'json-minifier':{
  intro:'Remove unnecessary JSON whitespace to produce a compact representation that is easier to transmit or embed.',
  bestFor:['API payload cleanup','compact configuration snippets','reducing readable JSON whitespace'],
 },
 'base64':{
  intro:'Encode or decode UTF-8 text as Base64 for common development, debugging, and data-transformation workflows.',
  bestFor:['API and HTTP debugging','embedded text values','development and test data'],
  tips:['Base64 is an encoding, not encryption.','Do not use Base64 to protect passwords, tokens, or other secrets.']
 },
 'url-encoder':{
  intro:'Encode or decode URL components so reserved characters can be represented safely in links and query values.',
  bestFor:['query string values','API request construction','debugging encoded URLs'],
 },
 'jwt-decoder':{
  intro:'Decode the readable header and payload portions of a JSON Web Token locally so you can inspect its claims during development.',
  bestFor:['debugging authentication flows','checking JWT claims and timestamps','development and test environments'],
  tips:['Decoding a JWT does not verify its signature.','Never paste a live production token into an unnecessary third-party service.']
 },
 'regex-tester':{
  intro:'Test JavaScript regular expressions against sample text and inspect matched values and capture groups.',
  bestFor:['form validation rules','log and text parsing','debugging regular expression behavior'],
 },
 'sql-formatter':{
  intro:'Reformat SQL into a more readable structure so clauses, joins, and expressions are easier to inspect and edit.',
  bestFor:['reviewing complex queries','cleaning copied SQL','preparing SQL for documentation'],
 },
 'merge-pdf':{
  intro:'Combine multiple PDF files into a single document directly in your browser for quick local document assembly.',
  bestFor:['combining reports and attachments','creating a submission packet','joining scanned pages into one PDF'],
 },
 'split-pdf':{
  intro:'Create a new PDF from selected pages of an existing document without sending the file to a remote processing service.',
  bestFor:['extracting chapters or sections','sharing selected pages','removing unrelated pages from a copy'],
 },
 'compress-pdf':{
  intro:'Create a smaller PDF by rasterizing pages into compressed images in the browser. The workflow can reduce size, but it can also remove selectable text and form structure.',
  bestFor:['sharing scanned documents','reducing image-heavy PDFs','quick size reduction when editability is not required'],
  tips:['This workflow rasterizes pages, so selectable text and forms are not preserved.','Compare the resulting file size and visual quality before replacing the original.']
 },
 'pdf-to-jpg':{
  intro:'Render PDF pages to JPG images locally and package the results for download.',
  bestFor:['turning document pages into images','sharing individual page previews','creating image assets from PDFs'],
 },
 'jpg-to-pdf':{
  intro:'Combine JPG, PNG, and WebP images into a PDF directly in the browser.',
  bestFor:['photo-to-document workflows','scanned image collections','creating a single shareable PDF'],
 },
 'image-compressor':{
  intro:'Reduce an image file size in the browser with adjustable quality while keeping the original file on your device.',
  bestFor:['website uploads','email and messaging attachments','making large photos easier to share'],
 },
 'image-resizer':{
  intro:'Resize an image in the browser with optional width and height controls for common publishing and upload requirements.',
  bestFor:['social and website dimensions','profile and thumbnail preparation','meeting upload limits'],
 },
 'image-converter':{
  intro:'Convert browser-supported images between common formats without a server-side upload step.',
  bestFor:['JPG, PNG, and WebP workflows','web asset preparation','compatibility fixes between apps'],
 },
 'jpg-to-png':{
  intro:'Convert JPG images to PNG in the browser when you need lossless-style PNG output or broader support for transparency-aware workflows.',
  bestFor:['web graphics preparation','editing workflows that expect PNG','moving JPG assets into a PNG pipeline'],
 },
 'png-to-jpg':{
  intro:'Convert PNG images to JPG in the browser when a smaller photographic format is more practical.',
  bestFor:['photo uploads','reducing PNG file sizes','systems that require JPG input'],
  tips:['JPG does not preserve transparency, so transparent PNG backgrounds will be flattened by the conversion.']
 },
 'percentage-calculator':{
  intro:'Calculate percentages and percentage changes quickly for everyday math, reports, comparisons, and planning.',
  bestFor:['percentage-of-total questions','percentage change','quick report calculations'],
 },
 'discount-calculator':{
  intro:'Work out discount savings and the final sale price from an original amount and percentage discount.',
  bestFor:['shopping comparisons','sale-price checks','pricing and invoice calculations'],
 },
 'age-calculator':{
  intro:'Calculate an age from a birth date using the current date in your browser.',
  bestFor:['birthday and age checks','form preparation','date-based planning'],
 },
 'date-calculator':{
  intro:'Calculate the number of days between two dates for scheduling, planning, and date-based comparisons.',
  bestFor:['deadline checks','project planning','date difference calculations'],
 },
 'bmi-calculator':{
  intro:'Calculate body mass index from weight and height as a quick reference value.',
  bestFor:['general health reference','classroom examples','quick BMI calculations'],
  tips:['BMI is a screening measure rather than a complete health assessment.','Use professional medical guidance for health decisions.']
 },
 'loan-calculator':{
  intro:'Estimate a monthly loan payment from principal, annual rate, and repayment months using a standard installment formula.',
  bestFor:['loan scenario comparisons','budget planning','quick repayment estimates'],
 },
 'emi-calculator':{
  intro:'Estimate an equated monthly installment from principal, annual rate, and loan duration.',
  bestFor:['loan affordability checks','repayment comparisons','quick finance estimates'],
 },
 'unit-converter':{
  intro:'Convert common length, weight, temperature, and volume units without opening a separate conversion app.',
  bestFor:['travel and shopping conversions','school and study tasks','technical and everyday unit checks'],
 },
 'password-generator':{
  intro:'Generate strong random passwords locally with adjustable length using browser cryptographic randomness.',
  bestFor:['new account passwords','development test credentials','temporary secure strings'],
  tips:['Store passwords in a password manager rather than in plain text notes.','Never reuse an important password across services.']
 },
 'sha-256':{
  intro:'Generate a SHA-256 digest from text in your browser for common development, integrity, and learning workflows.',
  bestFor:['checksum-style comparisons','API signature debugging','hashing demonstrations'],
  tips:['A SHA-256 digest is one-way; it is not encryption.']
 },
 'sha-512':{
  intro:'Generate a SHA-512 digest from text locally for development, integrity checks, and hashing experiments.',
  bestFor:['integrity comparisons','development diagnostics','hashing demonstrations'],
 },
 'md5':{
  intro:'Generate an MD5 digest from text for legacy compatibility and debugging workflows.',
  bestFor:['legacy checksum comparisons','debugging existing MD5-based systems','learning hash output'],
  tips:['MD5 is not suitable for modern password storage or security-sensitive collision resistance.']
 },
 'color-contrast-checker':{
  intro:'Measure the contrast ratio between foreground and background colors and compare it with common WCAG thresholds.',
  bestFor:['accessible UI checks','design handoff reviews','website text contrast testing'],
 }
}

export function getToolSeoProfile(tool:ToolDefinition):ToolSeoProfile{
 const base=categoryGuidance[tool.category]
 const custom=overrides[tool.id]??{}
 const intro=custom.intro??`${tool.name} is a ${base.intro.charAt(0).toLowerCase()}${base.intro.slice(1)}`
 const bestFor=custom.bestFor??[`${tool.category.toLowerCase()} workflows`,`quick ${tool.name.toLowerCase()} tasks`,`browser-based utility work`]
 const workflow=custom.workflow??base.workflow
 const tips=[...(custom.tips??[]),...base.tips].slice(0,4)
 const faq=custom.faq??[
  {question:`Who is ${tool.name} useful for?`,answer:`It is useful when you need ${bestFor[0]} or another quick browser-based workflow related to this task.`},
  {question:`Does ${tool.name} require an account?`,answer:'No account is required for the core ToolsKit workflow.'},
  tool.file
   ? {question:'Are files uploaded?',answer:'This tool is designed to process the selected file in your browser rather than relying on a dedicated ToolsKit upload-processing server.'}
   : {question:`Can I use ${tool.name} without installing software?`,answer:'Yes. The core workflow runs in a modern web browser.'}
 ]
 return {intro,bestFor,workflow,tips,faq}
}

export function getRelatedTools(currentId:string){
 const current=tools.find(tool=>tool.id===currentId)
 if(!current)return []
 return tools
  .filter(tool=>tool.id!==currentId)
  .map(tool=>{
   const sameCategory=tool.category===current.category?4:0
   const overlap=tool.keywords.filter(keyword=>current.keywords.includes(keyword)).length
   const nameOverlap=tool.name.toLowerCase().split(/\s+/).filter(word=>current.name.toLowerCase().includes(word)).length
   return {tool,score:sameCategory+overlap*3+nameOverlap}
  })
  .sort((a,b)=>b.score-a.score||a.tool.name.localeCompare(b.tool.name))
  .slice(0,6)
  .map(item=>item.tool)
}
