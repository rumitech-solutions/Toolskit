import {getTool} from './toolRegistry'
import {getPrimaryWorkflowForTool} from './workflows'
import {Icon} from './Icons'

interface Props {
  toolId: string
  onSelect?: (toolId: string) => void
}

export default function WorkflowLinks({toolId,onSelect}:Props){
  const workflow=getPrimaryWorkflowForTool(toolId)
  if(!workflow)return null

  return <section className="workflow-card" aria-label={workflow.name}>
    <div className="workflow-head">
      <div>
        <span className="section-kicker">Suggested workflow</span>
        <h3>{workflow.name}</h3>
        <p>{workflow.description}</p>
      </div>
      <span className="workflow-local"><Icon name="sparkles" size={14}/> Finish in one flow</span>
    </div>
    <div className="workflow-steps">
      {workflow.steps.map((step,index)=>{
        const target=getTool(step.toolId)
        if(!target)return null
        const current=step.toolId===toolId
        const content=<><span className="workflow-number">{index+1}</span><span><strong>{step.label}</strong><small>{target.name}</small></span>{!current&&<Icon name="arrow" size={14}/>}</>
        if(current)return <div key={step.toolId} className="workflow-step current" aria-current="page">{content}</div>
        if(onSelect)return <button key={step.toolId} type="button" className="workflow-step" onClick={()=>onSelect(step.toolId)}>{content}</button>
        return <a key={step.toolId} className="workflow-step" href={`/tools/${step.toolId}`}>{content}</a>
      })}
    </div>
  </section>
}